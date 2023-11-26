import { ExecException, exec } from "child_process";

export interface containerStatus {
    isRunning?: boolean;
    isPaused?: boolean;
    isRestarting?: boolean;
    isDead?: boolean;
    execInfo: {
        error?: ExecException;
        stdout?: string;
        stderr?: string;
    } 
}

export interface serverStatus {
    minecraftStatus: containerStatus;
    backupStatus: containerStatus;
}

/*
*   UTILITY FUNCTIONS
*/

function getContainerStatus(container_name: string): Promise<containerStatus> {
    return new Promise<containerStatus>((resolve, reject) => {
        let containerStatus: containerStatus = { execInfo: { } }
        const command = `docker container inspect ${container_name}`;

        const child = exec(command, (error, stdout, stderr) => {

            if (error !== null) {
                console.log(`ERROR: ${error}`);
                containerStatus.execInfo.error = error;
                reject(containerStatus);
            }

            if (stderr !== (null || "")) {
                console.log(`STDERR: ${stderr}`);
                containerStatus.execInfo.stderr = stderr;
                reject(containerStatus);
            }

            if (stdout !== (null || "")) {
                const containerInfo = JSON.parse(stdout)[0];
                containerStatus.isRunning = containerInfo?.State?.Running;
                containerStatus.isPaused = containerInfo?.State?.Paused;
                containerStatus.isRestarting = containerInfo?.State?.Restarting;
                containerStatus.isDead = containerInfo?.State?.Dead;

                resolve(containerStatus);
            }
        })
    
    })

}

/*
*   SERVER FUNCTIONS
*/

export function getServerStatus(minecraftContainerName: string = "mc_docker_webapp-redis-1", backupContainerName: string = "mc_docker_webapp-redis-1"): Promise<serverStatus> {
    return new Promise<serverStatus>((resolve, reject) => {
        let minecraftStatus: containerStatus = { execInfo: {}};
        let backupStatus: containerStatus = { execInfo: {}};

        Promise.all([
            getContainerStatus(minecraftContainerName),
            getContainerStatus(backupContainerName)
        ])
        .then(([minecraft, backup]) => {
            minecraftStatus = minecraft;
            backupStatus = backup;
            resolve({
                minecraftStatus,
                backupStatus
            });
        })
        .catch(error => {   // containers do not exist
            resolve({
                minecraftStatus: {
                    execInfo: {},
                    isRunning: false,
                    isDead: false,
                    isRestarting: false,
                    isPaused: false,
                },
                backupStatus: {
                    execInfo: {},
                    isRunning: false,
                    isDead: false,
                    isRestarting: false,
                    isPaused: false,
                }
            })
        });

        
    })
}

export function startServer(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const command: string = "docker compose up -d";
        const child = exec(command, { cwd: path }, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`EXECERR: ${error}`);
                reject(error);
            }

            /*
            *   For whatever reason, all docker compose logs are routed to stderr
            *   which basically means we are not going to check stdout
            *   This makes me incredibly infuriated but it is what it is
            */

            if (stderr !== (null || "")) {
                resolve(stderr);
            }
        })
    })
    
}

export function stopServer(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const command: string = "docker compose down";
        const child = exec(command, { cwd: path }, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`EXECERR: ${error}`);
                reject(error);
            }

            /*
            *   For whatever reason, all docker compose logs are routed to stderr
            *   which basically means we are not going to check stdout
            *   This makes me incredibly infuriated but it is what it is
            */

            if (stderr !== (null || "")) {
                resolve(stderr);
            }

            if (stderr == "") {
                resolve("Server is not running");
            }
        })
    })
}

export function restartServer(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const command: string = "docker compose restart";
        const child = exec(command, { cwd: path }, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`EXECERR: ${error}`);
                reject(error);
            }

            /*
            *   For whatever reason, all docker compose logs are routed to stderr
            *   which basically means we are not going to check stdout
            *   This makes me incredibly infuriated but it is what it is
            */

            if (stderr !== (null || "")) {
                resolve(stderr);
            }

            if (stderr == "") {
                resolve("Server was not running, please start it first.");
            }
        })
    })
}