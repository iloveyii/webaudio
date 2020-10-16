import React from "react";
import { withStyles } from '@material-ui/styles';
import PageHeader from "../PageHeader";
import {
  Container,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Typography
} from "@material-ui/core";
import PlayCircleOutlineOutlinedIcon from '@material-ui/icons/PlayCircleOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@material-ui/icons/PauseCircleOutlineOutlined';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import SettingsVoiceOutlinedIcon from '@material-ui/icons/SettingsVoiceOutlined';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import IconButton from '@material-ui/core/IconButton';


const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3)
  },
  iconsLarge: {
    height: 90,
    width: 90
  },
  iconsStop: {
    height: 120,
    width: 120
  }
});

const options = { audio: true, video: false};
const statuses = {
  READY: 1,
  RECORDING: 2,
  PLAYING: 3,
  FINISHED: 4,
  STOPPED: 5,
}

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeElapsed: 0,
      status: statuses.READY
    }
    this.webAudioRecorder = null;
    this.audioContext = null;
  }

  componentDidMount() {
      console.log('componentDidMount Audio');  
      navigator.mediaDevices.getUserMedia(options)
      .then(stream => {
          console.log('Audio stream ', stream);
          let AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new AudioContext();
          let source = this.audioContext.createMediaStreamSource(stream);
          this.webAudioRecorder = new WebAudioRecorder(source, {
            workerDir: 'web_audio_recorder_js/',
            encoding: 'mp3',
            options: {
                encodeAfterRecord: true,
                mp3: { bitRate: '320' }    
            } 
        });

        this.webAudioRecorder.onComplete = (webAudioRecorder, blob) => {
            window.blob = blob;

            let audioElementSource = window.URL.createObjectURL(blob);
            window.el = audioElementSource;
            document.getElementById('audio').src = audioElementSource;
            document.getElementById('audio').controls = true;

        }
        this.webAudioRecorder.onError = (webAudioRecorder, err) => {
            console.error(err);
        }


        document.getElementById('audio').onended = () => {
          this.setState({status: statuses.READY});
        }

        return 'hello';

      })
      .then(source => {
          console.log('Audio source ', source)
      })
      ;     
  }


  

  onStart = e => {
    let {status} = this.state;
    if(status === statuses.READY) {
      this.setState({status: statuses.RECORDING});
      this.intHandle = setInterval(()=> {
        const timeElapsed = Math.ceil(this.webAudioRecorder.recordingTime());
        console.log(timeElapsed)
        this.setState({timeElapsed});
      }, 1000);
      this.webAudioRecorder.startRecording();
    }
  }

  onStop = e => {
    this.webAudioRecorder.finishRecording();
    clearInterval(this.intHandle);
    this.setState({status: statuses.STOPPED});
  }

  onPlay = e => {
    if([statuses.STOPPED, statuses.FINISHED].includes(this.state.status)) {
      document.getElementById('audio').play();
      this.setState({status: statuses.PLAYING});
    }
  }
 
  

  render() {
    const {classes} = this.props;

    return (
        <Container maxWidth="md">
        <PageHeader
          title="AUDIO"
          subtitle="Audio recording and play back"
          imageUrl="/images/settings.png"
        />

        <Paper className={classes.root} elevation={0}>
          <Card className={classes.outer} variant="outlined" raised={false}>
            <CardMedia className={classes.cover} image={'imageUrl'} />

            <CardContent className={classes.details}>
              <Typography component="h5" variant="h5">
                {this.state.timeElapsed} : {this.state.status}
              </Typography>
              
              <audio style={{display: 'none'}} id="audio" src=""></audio> 

                <div className="holder">

                <IconButton onClick={this.onStop} className="stop" aria-label="delete">
                    <StopOutlinedIcon color="primary" className={classes.iconsStop}/>
                </IconButton>

                  <div className='record'>
                    <button onClick={this.onStart} data-recording={this.state.status === statuses.RECORDING} className="round-button">Save</button>
                  </div>

                  <IconButton onClick={this.onPlay} className="start" aria-label="delete">
                    <PlayCircleOutlineOutlinedIcon color="secondary" className={classes.iconsLarge}/>
                    </IconButton>
                </div>
            </CardContent>
          </Card>
        </Paper>
      </Container>
    );
  }
}


export default withStyles(styles)(index);
