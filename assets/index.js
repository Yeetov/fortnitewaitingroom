/* eslint-disable no-restricted-syntax */
import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

document.querySelector('main[hidden]')?.removeAttribute('hidden');

const socket = io('/');

const backgroundUrls = [
    'https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg',
    'https://cdn2.unrealengine.com/t-s21-stamina-lobby-2048x1024-87eb7cd878e4.png',
    'https://cdn2.unrealengine.com/t-bp23-lobby-2048x1024-2048x1024-26f2c1b27f63.png',
    'https://cdn2.unrealengine.com/fn-shop-ch4s3-04-1920x1080-785ce1d90213.png',
    'https://cdn2.unrealengine.com/s25-lobby-4k-4096x2048-4a832928e11f.jpg',
    'https://cdn2.unrealengine.com/05-28br-c5s1-videoscreenshotresizing-environment-b-still006-3840x2160-3840x2160-8045596055db.jpg',
    'https://cdn2.unrealengine.com/07-28br-c5s1-videoscreenshotresizing-environment-a-still007-3840x2160-3840x2160-a37e948d9571.jpg',
    'https://cdn2.unrealengine.com/09-28br-c5s1-videoscreenshotresizing-environment-a-still005-3840x2160-3840x2160-df70b698d25b.jpg',
    'https://cdn2.unrealengine.com/fortnite-battle-royale-chapter-5-season-1-screenshot-a-1920x1080-91f507e691cb.jpg',
    '/assets/images/backgrounds/fn-metaverse.png',
    '/assets/images/backgrounds/Adventure.png',
    '/assets/images/backgrounds/Aquarium.png',
    '/assets/images/backgrounds/BattleBus.png',
    '/assets/images/backgrounds/Beach.png',
    '/assets/images/backgrounds/Cube.png',
    '/assets/images/backgrounds/Jungle.png',
    '/assets/images/backgrounds/Party.png',
    '/assets/images/backgrounds/Villa.png',
    '/assets/images/backgrounds/ZoneWars.png',
];

const backgroundUrl = backgroundUrls[Math.floor(Math.random() * backgroundUrls.length)];

document.addEventListener('DOMContentLoaded', () => {
    const lobbyBackgroundImage = document.querySelector('.background-image');

    if (lobbyBackgroundImage) {
        lobbyBackgroundImage.src = backgroundUrl;
    }
});

function formatSeconds(seconds) {
    return new Date(seconds * 1000)
        .toISOString()
        .slice(11, 19)
        .replace(/^(00:)+/, '');
}

socket.on('status', (data) => {
    if (!data) {
        return;
    }

    console.info('Got API Data', data);

    const serverCurrentStatus = document.querySelector('.server-status');
    const serverCurrentStatusContainer = document.querySelector('.server-container');
    const serverCurrentStatusMessage = document.querySelector('.server-status-message');
    const serverCurrentStatusTimestamp = document.querySelector('.server-status-modifiedtime');
    const serverDowntimeDate = document.querySelector('.server-downtime-time');
    const serverDowntimeTimestamp = document.querySelector('.server-downtime-modifiedtime');
    const queueCurrentStatus = document.querySelector('.queue-status');
    const queueCurrentStatusContainer = document.querySelector('.queue-container');
    const queueCurrentAmount = document.querySelector('.queue-time-current');
    const queueCurrentAmountTimestamp = document.querySelector('.queue-status-modifiedtime');
    const queueHighestAmount = document.querySelector('.queue-time-highest');
    const queueHighestAmountTimestamp = document.querySelector('.queue-time-highest-modifiedtime');
    const lobbyBackgroundImage = document.querySelector('.background-image');

    if (data?.server?.current) {
        if (data.server.current.isUp) {
            serverCurrentStatus.textContent = 'Online';
            serverCurrentStatus.classList.add('enabled');
            serverCurrentStatus.classList.remove('disabled');
            serverCurrentStatusContainer.classList.add('enabled-background');
            serverCurrentStatusContainer.classList.remove('disabled-background');
        } else {
            serverCurrentStatus.textContent = 'Offline';
            serverCurrentStatus.classList.add('disabled');
            serverCurrentStatus.classList.remove('enabled');
            serverCurrentStatusContainer.classList.add('disabled-background');
            serverCurrentStatusContainer.classList.remove('enabled-background');
        }

        serverCurrentStatusMessage.textContent = data.server.current.message;
        serverCurrentStatusMessage.classList.remove('unknown');
        serverCurrentStatusTimestamp.textContent = new Date(data.server.current.lastModified).toLocaleString();
        serverCurrentStatusTimestamp.classList.remove('unknown');
    } else {
        serverCurrentStatus.textContent = 'Unknown';
        serverCurrentStatus.classList.remove('disabled');
        serverCurrentStatus.classList.remove('enabled');
        serverCurrentStatusContainer.classList.remove('disabled-background');
        serverCurrentStatusContainer.classList.remove('enabled-background');
        serverCurrentStatusMessage.textContent = 'Unknown';
        serverCurrentStatusMessage.classList.add('unknown');
        serverCurrentStatusTimestamp.textContent = 'Unknown';
        serverCurrentStatusTimestamp.classList.add('unknown');
    }

    if (data?.server?.scheduled) {
        if (data.server.scheduled.downtimeStart !== null) {
            serverDowntimeDate.textContent = new Date(data.server.scheduled.downtimeStart).toLocaleString();
            serverDowntimeDate.classList.remove('unknown');
        }

        serverDowntimeTimestamp.textContent = new Date(data.server.scheduled.lastModified).toLocaleString();
        serverDowntimeTimestamp.classList.remove('unknown');
    } else {
        serverDowntimeDate.textContent = 'Unknown';
        serverDowntimeDate.classList.add('unknown');
        serverDowntimeTimestamp.textContent = 'Unknown';
        serverDowntimeTimestamp.classList.add('unknown');
    }

    if (data?.queue?.current) {
        if (data.queue.current.enabled) {
            queueCurrentStatus.textContent = 'Enabled';
            queueCurrentStatus.classList.add('enabled');
            queueCurrentStatus.classList.remove('disabled');
            queueCurrentStatusContainer.classList.add('enabled-background');
            queueCurrentStatusContainer.classList.remove('disabled-background');
        } else {
            queueCurrentStatus.textContent = 'Disabled';
            queueCurrentStatus.classList.add('disabled');
            queueCurrentStatus.classList.remove('enabled');
            queueCurrentStatusContainer.classList.add('disabled-background');
            queueCurrentStatusContainer.classList.remove('enabled-background');
        }

        if (data.queue.current.time !== null) {
            queueCurrentAmount.textContent = formatSeconds(data.queue.current.time);
            queueCurrentAmount.classList.remove('unknown');
        } else {
            queueCurrentAmount.textContent = 'None';
            queueCurrentAmount.classList.remove('unknown');
        }

        queueCurrentAmountTimestamp.textContent = new Date(data.queue.current.lastModified).toLocaleString();
        queueCurrentAmountTimestamp.classList.remove('unknown');
    } else {
        queueCurrentStatus.textContent = 'Unknown';
        queueCurrentStatus.classList.remove('disabled');
        queueCurrentStatus.classList.remove('enabled');
        queueCurrentStatusContainer.classList.remove('disabled-background');
        queueCurrentStatusContainer.classList.remove('enabled-background');
        queueCurrentAmount.textContent = 'Unknown';
        queueCurrentAmount.classList.add('unknown');
        queueCurrentAmountTimestamp.textContent = 'Unknown';
        queueCurrentAmountTimestamp.classList.remove('unknown');
    }

    if (data?.queue?.highest) {
        queueHighestAmount.textContent = formatSeconds(data.queue.highest.time);
        queueHighestAmount.classList.remove('unknown');
        queueHighestAmountTimestamp.textContent = new Date(data.queue.highest.lastModified).toLocaleString();
        queueHighestAmountTimestamp.classList.remove('unknown');
    } else {
        queueHighestAmount.textContent = 'Unknown';
        queueHighestAmount.classList.add('unknown');
        queueHighestAmountTimestamp.textContent = 'Unknown';
        queueHighestAmountTimestamp.classList.add('unknown');
    }

    if (data?.background?.url) {
        if (data.background.url === lobbyBackgroundImage.src) {
            return;
        }

        lobbyBackgroundImage.src = data.background.url;
    } else {
        if (lobbyBackgroundImage.src === backgroundUrl) {
            return;
        }

        lobbyBackgroundImage.src = backgroundUrl;
    }
});
