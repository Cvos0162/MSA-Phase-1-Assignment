import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import deepPurple from '@material-ui/core/colors/deepPurple';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import * as React from "react";
import { Card, CardContent, CardHeader } from '../../node_modules/@material-ui/core';
import sunny from '../assets/Weather/if_weather-01_1530392.png';
import partly_cloudy from '../assets/Weather/if_weather-02_1530391.png';
import thundershower from '../assets/Weather/if_weather-08_1530385.png';
import hot from '../assets/Weather/if_weather-21_1530373.png';
import cloudy from '../assets/Weather/if_weather-22_1530369.png';
import thunderstorms from '../assets/Weather/if_weather-23_1530363.png';
import light_snow from '../assets/Weather/if_weather-24_1530371.png';
import snow from '../assets/Weather/if_weather-25_1530370.png';
import wind from '../assets/Weather/if_weather-26_1530361.png';
import foggy from '../assets/Weather/if_weather-27_1530368.png';
import smoke from '../assets/Weather/if_weather-28_1530367.png';
import shower from '../assets/Weather/if_weather-30_1530365.png';

export default class Weather extends React.Component<any, any> {
    
    constructor(props: any){
        super(props);
        this.state = {
            astronomy: null,
            atmosphere: null,
            condition: null,
            error: false,
            forecast: null,
            isFetching: false,
            location: "auckland",
            title: null,
            wind: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    public componentWillMount() {
        const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places%20where%20text%3D%22' + this.state.location + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        fetch(url)
            .then(response => response.json())
            .then(result => 
                {
                    try{
                        let i = 0;
                        let k = false;
                        if (result.query.results.hasOwnProperty('channel')) {
                            i = Object.keys(result.query.results.channel).length;
                        } else {                    
                            this.setState({error: true,
                                isFetching : true,
                                });
                        }
                        for(let j = 0; j < i; j++) {
                            if (result.query.results.channel[j].hasOwnProperty('item')) {
                                this.setState(
                                    {
                                        astronomy : result.query.results.channel[j].astronomy,
                                        atmosphere : result.query.results.channel[j].atmosphere,
                                        condition : result.query.results.channel[j].item.condition,
                                        error : false,
                                        forecast : result.query.results.channel[j].item.forecast,
                                        isFetching : true,
                                        title : result.query.results.channel[j].item.title,
                                        wind : result.query.results.channel[j].wind,
                                        
                                    }
                                )
                                k = true;
                                break;
                            }
                        }
                        if (k === false) {                    
                            this.setState({error: true,
                                isFetching : true,
                                });
                        }
                    }
                    catch(error){
                        this.setState({error: true,
                            isFetching : true,
                            });
                    }
            })
            .catch(null);
    }

    public load() {
        const fetching = this.state.isFetching;
        const error = this.state.error;
        if (error) {
            return "Failed to fetch data, try again, maybe with more specified location name\n";
        }
        else if (fetching) {
            return (
                <div>
                    <div>
                        {this.getCurrent()}
                    </div>
                    <div>
                        <GridList style={{flexWrap: "nowrap"}}>
                            {[0, 1, 2, 3, 4, 5, 6].map(value => this.getForecast(value))}
                        </GridList>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="centerItem">
                    <CircularProgress style={{ color: deepPurple[500]}} thickness={4} />
                </div>
            );
        }
    }

    public getCurrent() {
        const title = this.state.title;
        const code = this.state.condition.code;
        const sunrise = this.state.astronomy.sunrise;
        const sunset = this.state.astronomy.sunset;
        const humidity = this.state.atmosphere.humidity;
        const pressure = this.state.atmosphere.pressure;
        const windSpeed = this.state.wind.speed;
        const windDirection = this.state.wind.direction;
        const date = this.state.condition.date;
        const temp = this.state.condition.temp;
        const high:number = this.state.forecast[0].high;
        const low:number = this.state.forecast[0].low;
        const text = this.state.condition.text;
        return (
            <div className="weatherMain">
                <h4><b> {title} </b></h4>
                <Grid container={true} spacing={8}>
                    <Grid item={true} xs={2} className="centreText">
                        <img src={this.getImageAddress(code)} alt={"image not available for #"+code}/>
                    </Grid>
                    <Grid item={true} xs={2} className="centreText">
                        <p>
                            <h3><b>
                                Today<br/>
                            </b></h3>
                            {date}<br/>
                        </p>
                    </Grid>
                    <Grid item={true} xs={1} className="centreText">
                        <p>
                            {text}
                        </p>
                    </Grid>
                    <Grid item={true} xs={1} className="centreText">
                        <p>
                            <b>sunrise </b>{sunrise}<br/>
                            <b>sunset</b> {sunset}
                        </p>
                    </Grid>
                    <Grid item={true} xs={1} className="centreText">
                        <p>
                            <b>humidity </b>{humidity}%<br/>
                            <b>pressure</b> {pressure}mb<br/>
                        </p>
                    </Grid>
                    <Grid item={true} xs={2} className="centreText">
                        <p>
                            <b>wind speed </b>{windSpeed}mph<br/>
                            <b>wind direction</b> {windDirection}&deg;<br/>
                        </p>
                    </Grid>
                    <Grid item={true} xs={2} className="centreText">
                        <p>
                            <b>temp </b>{this.ftoC(temp).toFixed(1)}&deg;C<br/>
                            <b>high</b> {this.ftoC(high).toFixed(1)}&deg;C<br/>
                            <b>low </b>{this.ftoC(low).toFixed(1)}&deg;C<br/>
                        </p>
                    </Grid>
                </Grid>
            </div>
        );
    }

    public getForecast(num:number) {
        const code = this.state.forecast[num].code;
        const date = this.state.forecast[num].date;
        const day = this.state.forecast[num].day;
        const high = Number(this.state.forecast[num].high);
        const low = Number(this.state.forecast[num].low);
        const text = this.state.forecast[num].text;
        return (
            <Card className="weatherCard">
                <CardHeader
                    title = {day}
                    subheader = {date + ", " + text}
                />
                <CardContent>
                    <Typography component="p">
                        <img src={this.getImageAddress(code)} alt={"image not available for #"+code}/>
                        {this.ftoC((high+low)/2).toFixed(1)}&deg;C<br/>
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    public getImageAddress(code:string) {
        switch (code){
        case '31':
        case '32':
        case '33':
        case '34':
            return sunny;
        case '27':
        case '28':
        case '29':
        case '30':
        case '44':
            return partly_cloudy;
        case '26':
            return cloudy;
        case '47':
        case '45':
            return thundershower;
        case '36':
            return hot;
        case '3':
        case '4':
            return thunderstorms;
        case '13':
        case '14':
        case '42':
            return light_snow;
        case '15':
        case '16':
        case '41':
        case '43':
            return snow;
        case '20':
            return foggy;
        case '19':
        case '21':
        case '22':
            return smoke;
        case '23':
        case '24':
            return wind;
        case '11':
        case '12':
        case '39':
        case '40':
            return shower;
        default:
            return '';
        }
    }

    public ftoC(num:number) {
        const temp = (num-32)*5/9;
        return temp;
    }

    public handleChange(event:any){
        this.setState({location: event.target.value});
    }
    
    public handleSubmit(event:any) {
        this.componentWillMount();
        event.preventDefault();
    }

    public render() {
        return (
            <div>
                <div>
                    {this.load()}
                </div>
                <Divider />
                <div>
                    <form onSubmit={this.handleSubmit}>
                    <b>
                        City:
                    </b>
                    <Input
                        type="search"
                        defaultValue={this.state.location}
                        placeholder="Location"
                        onChange={this.handleChange}
                        style={{fontSize: "12pt", padding: "6pt", backgroundColor: "#f2f2f2"}}
                    />
                    <Button mini={true} variant="fab" aria-label="Submit" type="submit">
                        <SearchIcon/>
                    </Button>
                    </form>
                </div>
                <div>
                    <a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/purple.png" width="134" height="29"/> </a>
                </div>
            </div>
        );
    }
}