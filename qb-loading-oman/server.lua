local RESOURCE = GetCurrentResourceName()

RegisterNetEvent(RESOURCE .. ':requestStats', function()
    local src = source
    TriggerClientEvent(RESOURCE .. ':stats', src, {
        players    = #GetPlayers(),
        maxPlayers = GetConvarInt('sv_maxclients', 48),
    })
end)
