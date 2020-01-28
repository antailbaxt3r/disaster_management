import React from 'react';
// import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import hmdata from './trees.geojson';

class HeatMap extends React.Component{
    constructor(props){
        super(props);
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2F1bm1lcmEiLCJhIjoiY2s1d250M2ppMTRwcTNtbXhwYjhxMzZncCJ9.g58k81HwvrrIG-1tjAHKAw';
        this.state = {
            lng:5,
            lat:34,
            zoom:12,
        };
    }

    componentDidMount(){
        window.navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({lat: position.coords.latitude, lng: position.coords.longitude});
                const map = new mapboxgl.Map({
                    container: document.querySelector("#heatMap"),
                    center: [-79.999732, 40.4374],
                    style: 'mapbox://styles/mapbox/streets-v11',
                    zoom: this.state.zoom,
                });

                map.on('load', () => {
                    map.addSource('trees', {
                        type: 'geojson',
                        data: hmdata,   //data for density in geojson format
                    })

                    map.addLayer({
                        id: 'trees-heat',
                        type: 'heatmap',
                        source: 'trees',
                        maxzoom: 15,
                        paint: {
                            // increase weight as diameter breast height increases
                            'heatmap-weight': {
                            property: 'dbh',
                            type: 'exponential',
                            stops: [
                                [1, 0],
                                [62, 1]
                            ]
                            },
                            // increase intensity as zoom level increases
                            'heatmap-intensity': {
                            stops: [
                                [11, 1],
                                [15, 3]
                            ]
                            },
                            // assign color values be applied to points depending on their density
                            'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0, 'rgba(236,222,239,0)',
                            0.2, 'rgb(208,209,230)',
                            0.4, 'rgb(166,189,219)',
                            0.6, 'rgb(103,169,207)',
                            0.8, 'rgb(28,144,153)'
                            ],
                            // increase radius as zoom increases
                            'heatmap-radius': {
                            stops: [
                                [11, 15],
                                [15, 20]
                            ]
                            },
                            // decrease opacity to transition into the circle layer
                            'heatmap-opacity': {
                            default: 1,
                            stops: [
                                [14, 1],
                                [15, 0]
                            ]
                            },
                        }
                    }, 'waterway-label');

                    map.addLayer({
                        id: 'trees-point',
                        type: 'circle',
                        source: 'trees',
                        minzoom: 14,
                        paint: {
                          // increase the radius of the circle as the zoom level and dbh value increases
                          'circle-radius': {
                            property: 'dbh',
                            type: 'exponential',
                            stops: [
                              [{ zoom: 15, value: 1 }, 5],
                              [{ zoom: 15, value: 62 }, 10],
                              [{ zoom: 22, value: 1 }, 20],
                              [{ zoom: 22, value: 62 }, 50],
                            ]
                          },
                          'circle-color': {
                            property: 'dbh',
                            type: 'exponential',
                            stops: [
                              [0, 'rgba(236,222,239,0)'],
                              [10, 'rgb(236,222,239)'],
                              [20, 'rgb(208,209,230)'],
                              [30, 'rgb(166,189,219)'],
                              [40, 'rgb(103,169,207)'],
                              [50, 'rgb(28,144,153)'],
                              [60, 'rgb(1,108,89)']
                            ]
                          },
                          'circle-stroke-color': 'white',
                          'circle-stroke-width': 1,
                          'circle-opacity': {
                            stops: [
                              [14, 0],
                              [15, 1]
                            ]
                          }
                        }
                      }, 'waterway-label');
                })
            })}

    render(){
        return(<div style={{height: '50vh', width: '50vh'}} id="heatMap">

        </div>
        );
    }
}

export default HeatMap;