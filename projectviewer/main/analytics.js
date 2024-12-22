async function sendAnalytics() {
    await fetch('https://cwww-analytics.cubiodojo.workers.dev/analytics', {
        method: 'GET',
    });
}

sendAnalytics();