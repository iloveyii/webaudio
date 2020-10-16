import React from "react";
import { withStyles } from '@material-ui/styles';
import PageHeader from "../PageHeader";
import {
  createMuiTheme,
  Container,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button
} from "@material-ui/core";


const theme = createMuiTheme({
    
  });
const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3)
  }
});

const options = { audio: true, video: false};

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

        return 'hello';

      })
      .then(source => {
          console.log('Audio source ', source)
      })
      ;     
  }


  getBufferCallback = ( buffers ) => {
    var newSource = this.audioContext.createBufferSource();
    var newBuffer = this.audioContext.createBuffer( 2, buffers[0].length, this.audioContext.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    newSource.connect( this.audioContext.destination );
    newSource.start(0);
}

  onStart = e => {
    this.webAudioRecorder.startRecording();
  }

  onStop = e => {
    this.webAudioRecorder.finishRecording();
  }

  onPlay = e => {
  }
 
  

  render() {
    const {classes} = this.props;

    return (
        <Container maxWidth="md">
        <PageHeader
          title="SETTINGS"
          subtitle="Settings for app"
          imageUrl="/images/settings.png"
        />

        <Paper className={classes.root} elevation={0}>
          <Card className={classes.outer} variant="outlined" raised={false}>
            <CardMedia className={classes.cover} image={'imageUrl'} />

            <CardContent className={classes.details}>
              <Typography component="h5" variant="h5">
                title
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                sub
              </Typography>

              <audio id="audio" src=""></audio> 

              <Button
                    style={{ marginTop: "1em" }}
                    margin="normal"
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={this.onStart}
                    >
                    Start
                </Button>

                <Button
                    style={{ marginTop: "1em" }}
                    margin="normal"
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={this.onStop}
                    >
                    Stop
                </Button>

                <Button
                    style={{ marginTop: "1em" }}
                    margin="normal"
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={this.onPlay}
                    >
                    Play
                </Button>
            </CardContent>
          </Card>
        </Paper>
      </Container>
    );
  }
}


export default withStyles(styles)(index);
