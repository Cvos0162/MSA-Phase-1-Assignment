import CircularProgress from '@material-ui/core/CircularProgress';
import deepPurple from '@material-ui/core/colors/deepPurple';
import * as React from "react";

export default class Weather extends React.Component<any, any> {
    
    constructor(props: any){
        super(props);
        this.state = {
            astronomy: null,
            atmosphere: null,
            forecast: null,
            isFetching: false,
            title: null,
            wind: null,
        };
    }
  
    public componentWillMount() {
        const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22auckland%2Cnz%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        fetch(url)
            .then(response => response.json())
            .then(result => this.setState(
                {
                    isFetching : true,
                    astronomy : result.query.results.channel.astronomy,
                    atmosphere : result.query.results.channel.atmosphere,
                    condition : result.query.results.channel.item.condition,
                    forecast : result.query.results.channel.item.forecast,
                    title : result.query.results.channel.item.title,
                    wind : result.query.results.channel.wind,
                }
            ))
            .catch(null);
    }

    public load() {
        const fetching = this.state.isFetching;
        if (fetching) {
            return (
                <div>
                    {this.getCurrent()}
                    {this.getForecast(0)}
                    {this.getForecast(1)}
                    {this.getForecast(2)}
                    {this.getForecast(3)}
                    {this.getForecast(4)}
                </div>
            );
        } else {
            return (
                <div>
                    <CircularProgress style={{ color: deepPurple[500] }} thickness={4} />
                </div>
            );
        }
    }

    public getCurrent() {
        const sunrise = this.state.astronomy.sunrise;
        const sunset = this.state.astronomy.sunset;
        const humidity = this.state.atmosphere.humidity;
        const pressure = this.state.atmosphere.pressure;
        const windSpeed = this.state.wind.speed;
        const windDirection = this.state.wind.direction;
        const date = this.state.forecast[0].date;
        const day = this.state.forecast[0].day;
        const temp = this.state.condition.temp;
        const high = this.state.forecast[0].high;
        const low = this.state.forecast[0].low;
        const text = this.state.condition.text;
        return (
            <div className="centreText">
                <h3>Today</h3>
                sunrise {sunrise}<br/>
                sunset {sunset}<br/>
                humidity {humidity}%<br/>
                pressure {pressure}in<br/>
                wind speed {windSpeed}mph<br/>
                wind direction {windDirection}&deg;<br/>
                {date} {day}<br/>
                temp {temp}&deg;F<br/>
                high {high}&deg;F<br/>
                low {low}&deg;F<br/>
                {text}<br/>
            </div>
        );
    }

    public getForecast(num:number) {
        const date = this.state.forecast[num].date;
        const day = this.state.forecast[num].day;
        const high = this.state.forecast[num].high;
        const low = this.state.forecast[num].low;
        const text = this.state.forecast[num].text;
        return (
            <div className="centreText">
                {date} {day}<br/>
                high {high}&deg;F<br/>
                low {low}&deg;F<br/>
                {text}<br/>
            </div>
        );
    }

    public render() {
        return (
            <div>
                {this.load()}
            </div>
            /*
            <div id="Weather">
                <h3>Current Conditions</h3>
                {
                    this.state.isFetching ? <img className='loading' src='../public/images/triangle.gif' />
                    : this.state
                }
                <h3>Five-Day Forecast</h3>
                <div id="show-forecast">
                {
                    this.state.isFetching ? <img className='loading' src='../public/images/triangle.gif' />
                    : <a/>
                    })
                }
                </div>
            </div>
            */
        );
    }
}