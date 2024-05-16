console.log("ventasDelAnioXDS:", ventasDelAnio);
const anioSeleccionadoInput = document.getElementById('anio');
let anioSeleccionado = new Date().getFullYear();
obtenerDatosDeCompras(anioSeleccionado);

anioSeleccionadoInput.addEventListener('change', () => {
    anioSeleccionado = anioSeleccionadoInput.value
    console.log("AnioSeleccionado", anioSeleccionado);
    obtenerDatosDeCompras(anioSeleccionado);
});

function actualizarGrafica(anio,data) {
    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Compras Mensuales del Año ' + anio
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            accessibility: {
                description: 'Meses del año'
            }
        },
        yAxis: {
            title: {
                text: 'Compras'
            },
            labels: {
                format: 'S/. {value}'
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Compras',
            marker: {
                symbol: 'square'
            },
            data: data
        }]
    });
}

function obtenerDatosDeCompras(anio) {
    fetch(`/admin/dashboard/totalesMensualesPorAnio?anio=${anio}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al realizar la solicitud.');
          }
          return response.json();
        })
        .then(data => {
          actualizarGrafica(anio, data);
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
}