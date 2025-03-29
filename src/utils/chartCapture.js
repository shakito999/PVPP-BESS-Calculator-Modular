import html2canvas from 'html2canvas';

export const captureChart = (chartId) => {
  const chartElement = document.getElementById(chartId);
  if (!chartElement) {
    console.error(`Chart element with id ${chartId} not found`);
    return;
  }

  html2canvas(chartElement).then(canvas => {
    const link = document.createElement('a');
    link.download = `${chartId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => {
    console.error('Error capturing chart:', error);
  });
};
