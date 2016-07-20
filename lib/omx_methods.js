/**
 * properties and methods according to
 * https://specifications.freedesktop.org/mpris-spec/latest/Media_Player.html
 * https://specifications.freedesktop.org/mpris-spec/latest/Player_Interface.html
 **/
module.exports.properties = {
    'Fullscreen': {
        signature: 'b',
        read: true,
        write: true
    },
    'LoopStatus': {
        signature: 's',
        read: true,
        write: true
    },
    'Rate': {
        signature: 'd',
        read: true,
        write: false
    },
    'Shuffle': {
        signature: 'b',
        read: true,
        write: true
    },
    'Volume': {
        signature: 'd',
        read: true,
        write: true
    },
    'GetSource': {
        signature: 's',
        read: true,
        write: false
    },
    'CanQuit': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanSetFullscreen': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanRaise': {
        signature: 'b',
        read: true,
        write: false
    },
    'Identity': {
        signature: 'b',
        read: true,
        write: false
    },
    'DesktopEntry': {
        signature: 's',
        read: true,
        write: false
    },
    'SupportedUriSchemes': {
        signature: 's',
        read: true,
        write: false
    },
    'SupportedMimeTypes': {
        signature: 's',
        read: true,
        write: false
    },
    'PlaybackStatus': {
        signature: 's',
        read: true,
        write: false
    },
    'Metadata': {
        signature: 'a',
        read: true,
        write: false
    },
    'Position': {
        signature: 'x',
        read: true,
        write: false
    },
    'MinimumRate': {
        signature: 'd',
        read: true,
        write: false
    },
    'MaximumRate': {
        signature: 'd',
        read: true,
        write: false
    },
    'CanGoNext': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanPlay': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanPause': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanSeek': {
        signature: 'b',
        read: true,
        write: false
    },
    'CanCotrol': {
        signature: 'b',
        read: true,
        write: false
    },
    'Duration': {
        signature: 's',
        read: true,
        write: false
    }
};
module.exports.methods = {
    'Raise': {
        write: false
    },
    'Quit': {
        write: false
    },
    'Next': {
        write: false
    },
    'Previous': {
        write: false
    },
    'Pause': {
        write: false
    },
    'PlayPause': {
        write: false
    },
    'Stop': {
        write: false
    },
    'Play': {
        write: false
    },
    'Seek': {
        'signature': 'x',
        'type': 'offset',
        write: true
    },
    'SetPosition': {
        'signature': 'ox',
        'type': 'TrackId, Position',
        write: true
    },
    'SetAlpha': {
        'signature': 'ox',
        'type': 'NotUsed, Alpha',
        write: true
    },
    'VideoPos': {
        'signature': 'os',
        'type': 'NotUsed, "x1 y1 x2 y2"',
        write: true
    },
    'SetVideoCropPos': {
        'signature': 'os',
        'type': 'NotUsed, "x1 y1 x2 y2"',
        write: true
    },
    'SetAspectMode': {
        'signature': 'os',
        'type': 'NotUsed, "aspect"',
        write: true
    },
    'Action': {
        'signature': 'i',
        'type': 'actionNumber',
        write: true
    },
    'OpenUri': {
        'signature': 's',
        'type': 'Uri',
        write: true
    },
    'UnHideVideo': {
        write: false
    },
    'HideVideo': {
        write: false
    },
    'Mute': {
        write: false
    }
};
