<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    $: serverStatus = data.minecraftStatus.isDead ? "DEAD"
        : data.minecraftStatus.isRestarting ? "RESTARTING"
        : data.minecraftStatus.isPaused ? "PAUSED"
        : data.minecraftStatus.isRunning ? "RUNNING" 
        : "STOPPED"

    $: backupStatus = data.backupStatus.isDead ? "DEAD"
        : data.backupStatus.isRestarting ? "RESTARTING"
        : data.backupStatus.isPaused ? "PAUSED"
        : data.backupStatus.isRunning ? "RUNNING" 
        : "STOPPED"
</script>

<h1>Minecraft Server Dashboard</h1>

<h3>Status</h3>
<h4>Server: <span>{serverStatus}</span></h4>
<h4>Backups: <span>{backupStatus}</span></h4>

<form method='POST'>
    <button formaction="?/startserver">Start Server</button>
    <button formaction="?/stopserver">Stop Server</button>
    <button formaction="?/restartserver">Restart Server</button>
</form>

