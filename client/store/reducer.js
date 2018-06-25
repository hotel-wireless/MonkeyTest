const serverDescription = require('./serverdescription');

const MAX_LIMIT = 30000;

const initState = {
    filter: {
        back: {
            from: "",
            url: ""
        }
    },
    visibleSessionType: "back",
    frontStatus: false,
    backStatus: false,
    sessions: [],       // 服务端session
    sessionData: [],    // 服务端session 视图
    fSessions: [],      // 客户端session
    fSessionData: [],   // 客户端session 视图
    netchecks: [],      // 未熔断连接
    netcheckData: []    // 未熔断连接 视图
};

const appReducer = function (state=initState, action) {
    if(action.type === "ADD_NETCHECK_RECORD") {
        let { data } = action;
        let { timestamp, source, destination } = data;

        let record = state.netchecks.find((record) => record.source === source && record.destination === destination);
        if(record) {
            record.timeStamp = timestamp;
        } else {
            state.netchecks.push({
                timestamp, source, destination
            });
        }
    }

    if(action.type === "NEW_SERVER_REQUEST") {

        let data = {};
        if(action.data.serverType === "back") {
            data = {
                sessions: [...state.sessions, Object.assign({}, action.data, {statusCode: -1, size: -1})].slice(-MAX_LIMIT)
            };
        } else if(action.data.serverType === "front") {
            data = {
                fSessions: [...state.fSessions, Object.assign({}, action.data, {statusCode: -1, size: -1})].slice(-MAX_LIMIT)
            };
        }

        return Object.assign({}, state, data);
    }

    if(action.type === "NEW_CLIENT_RESPONSE") {
        let data = {};
        if(action.data.serverType === "back") {
            data = {
                sessions: state.sessions.map((session)=>{
                    if(session.id === action.data.id) {
                        return Object.assign({}, session, {
                            statusCode: action.data.statusCode,
                            size: action.data.size || 0,
                            isFuse: action.data.isFuse
                        });
                    }

                    return session;
                })
            };
        } else if(action.data.serverType === "front") {
             data = {
                fSessions: state.fSessions.map((session)=>{
                    if(session.id === action.data.id) {
                        return Object.assign({}, session, {
                            statusCode: action.data.statusCode,
                            size: action.data.size || 0,
                            isFuse: action.data.isFuse
                        });
                    }

                    return session;
                })
            };
        }

        return Object.assign({}, state, data);
    }

    if(action.type === "NEW_CLIENT_RESPONSE_DATA") {
        let data = {
            sessions: state.sessions.map((session)=>{
                if(session.id === action.data.id) {
                    return Object.assign({}, session, {
                        frame: action.data.frame
                    });
                }

                return session;
            })
        };

        return Object.assign({}, state, data);
    }

    if(action.type === "keepMaxLimit") {
        return Object.assign({}, state, {
            sessions: state.sessions.slice(-MAX_LIMIT),
            fSessions: state.fSessions.slice(-MAX_LIMIT)
        });
    }

    if(action.type === "updateViewData") {
        return Object.assign({}, state, {
            sessionData: state.sessions.filter(session=>{
                    if(!session.remoteAddress) {
                        return false;
                    }

                    return session.remoteAddress.startsWith(state.filter.back.from);
                }).filter(session=>{
                    if(!session.url) {
                        return false;
                    }

                    return session.url.indexOf(state.filter.back.url) > -1;
                }).map((session)=>{
                    return session;
                }),
            fSessionData: state.fSessions.map((session)=>{
                    return session;
                }),
            netcheckData: state.netchecks.map((record)=>{
                    return Object.assign(record, {
                        description: serverDescription(record.destination)
                    });
                }).sort((a, b) => a.source.localeCompare(b.source))
        });
    }

    if(action.type === "SET_VISIBLE_SESSION_TYPE") {
        return Object.assign({}, state, {
            visibleSessionType: action.data.type
        });
    }

    if(action.type === "FRONT_FUSE_ON") {
        return Object.assign({}, state, {
            frontStatus: true
        });
    }

    if(action.type === "FRONT_FUSE_OFF") {
        return Object.assign({}, state, {
            frontStatus: false
        });
    }

    if(action.type === "BACK_FUSE_ON") {
        return Object.assign({}, state, {
            backStatus: true
        });
    }

    if(action.type === "BACK_FUSE_OFF") {
        return Object.assign({}, state, {
            backStatus: false
        });
    }

    if(action.type === "CLEAR_BACK_SESSION") {
        return Object.assign({}, state, {
            sessions: [],
            sessionData: []
        });
    }

    if(action.type === "CLEAR_FRONT_SESSION") {
        return Object.assign({}, state, {
            fSessions: [],
            fSessionData: []
        });
    }

    if(action.type === "SET_BACK_FILTER_FROM") {
        return Object.assign({}, state, {
            filter: Object.assign({}, state.filter, {
                back: Object.assign({}, state.filter.back, {
                    from: action.data.from
                })
            })
        });
    }

    if(action.type === "SET_BACK_FILTER_URL") {
        return Object.assign({}, state, {
            filter: Object.assign({}, state.filter, {
                back: Object.assign({}, state.filter.back, {
                    url: action.data.url
                })
            })
        });
    }

    return state;
};

module.exports = appReducer;
