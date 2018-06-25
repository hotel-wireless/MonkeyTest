const initState = {
    frontStatus: false,
    backStatus: false
};

const appReducer = function (state=initState, action) {
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

    return state;
};

module.exports = appReducer;
