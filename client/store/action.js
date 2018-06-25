function setVisibleSessionType(type) {
    return {
        type: "SET_VISIBLE_SESSION_TYPE",
        data: {
            type
        }
    }
}

function clearBackSession() {
    return {
        type: "CLEAR_BACK_SESSION"
    }
}

function clearFrontSession() {
    return {
        type: "CLEAR_FRONT_SESSION"
    }
}

function setBackFilterFrom(from) {
    return {
        type: "SET_BACK_FILTER_FROM",
        data: {
            from
        }
    }
}

function setBackFilterUrl(url) {
    return {
        type: "SET_BACK_FILTER_URL",
        data: {
            url
        }
    }
}

function addNetCheckRecord(timestamp, source, destination) {
    return {
        type: "ADD_NETCHECK_RECORD",
        data: {
            timestamp,
            source,
            destination
        }
    }
}

module.exports = {
    setVisibleSessionType,
    clearBackSession,
    clearFrontSession,
    setBackFilterFrom,
    setBackFilterUrl,
    addNetCheckRecord
};
