export const actions = {
    startserver: async (event) => {
        await fetch("http://localhost:3000/server/start",
            {
                method: 'POST'
            })
    },

    stopserver: async (event) => {
        await fetch("http://localhost:3000/server/stop",
            {
                method: 'POST'
            })
    },

    restartserver: async (event) => {
        await fetch("http://localhost:3000/server/restart",
            {
                method: 'POST'
            })
    }
}