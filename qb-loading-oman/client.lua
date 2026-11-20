local RESOURCE = GetCurrentResourceName()

local function send(payload)
    SendLoadingScreenMessage(json.encode(payload))
end

local function buildConfig()
    return {
        type = 'init',
        config = {
            serverName     = Config.ServerName,
            version        = Config.Version,
            lang           = Config.DefaultLanguage,
            theme          = Config.Theme,
            countdown      = Config.Countdown,
            backgrounds    = Config.Backgrounds,
            socials        = Config.Socials,
            tips           = Config.Tips,
            statusMessages = Config.StatusMessages,
            readyMessage   = Config.ReadyMessage,
            music          = Config.Music,
            ui             = Config.UI,
        },
    }
end

-- نكرر الإرسال لثوانٍ لأن صفحة التحميل قد تُجهَّز متأخرة بعد تشغيل السكربت.
-- الواجهة تتجاهل التكرار، فهذا آمن.
CreateThread(function()
    for _ = 1, 24 do
        send(buildConfig())
        Wait(250)
    end
end)

CreateThread(function()
    Wait(400)

    for _ = 1, 12 do
        local name = GetPlayerName(PlayerId())
        if name and name ~= '' then
            send({ type = 'player', name = name })
            break
        end
        Wait(250)
    end

    TriggerServerEvent(RESOURCE .. ':requestStats')
end)

RegisterNetEvent(RESOURCE .. ':stats', function(stats)
    if type(stats) ~= 'table' then return end
    send({
        type       = 'stats',
        players    = stats.players or 0,
        maxPlayers = stats.maxPlayers or 0,
    })
end)

AddEventHandler('playerSpawned', function()
    send({ type = 'ready' })
    DoScreenFadeIn(800)
end)
