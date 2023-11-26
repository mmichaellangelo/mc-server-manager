import type { PageData, PageLoad } from "./$types"

export async function load({ fetch, params }) {

    const res = await fetch('http://localhost:3000/server/status',
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
    const status = await res.json();
    console.log(status);

    return {
        minecraftStatus: {
            isRunning: status.minecraftStatus.isRunning,
            isPaused: status.minecraftStatus.isPaused,
            isRestarting: status.minecraftStatus.isRestarting,
            isDead: status.minecraftStatus.isDead
        },
        backupStatus: {
            isRunning: status.backupStatus.isRunning,
            isPaused: status.backupStatus.isPaused,
            isRestarting: status.backupStatus.isRestarting,
            isDead: status.backupStatus.isDead
        }
    }

}
