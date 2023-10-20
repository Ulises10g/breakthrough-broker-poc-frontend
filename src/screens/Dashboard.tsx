import React, { useCallback, useMemo, useState } from 'react'
import { Container, Box, Grid, Button, TextField } from '@mui/material'
import { useStopwatch } from 'react-timer-hook';
import { axios, quitLoading, setLoading } from 'utils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { connect } from 'react-redux';
import * as actions from '../reducers/templateSlice';
import { TemplateLog } from 'models/Template';

const mapStateToProps = (state: any) => state;

const mapDispatchToProps = (dispatch: any) => ({
  updateLogs: (state: any) => dispatch(actions.updateLogs(state)),
});

function Dashboard(props: any) {
  const [quantity, setQuantity] = useState(10000);
  const [isTaskWorking, setTaskIsWorking] = useState(false);
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch();
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
  const handleAddEvent = async (db: string, value: number) => {
    try {
      setTaskIsWorking(true)
      reset()
      start()
      setLoading()
      await axios.post(db, {
        quantity: value
      });
    } catch (error) {
      console.log('>>: Error> ', error)
    } finally {
      pause()
      addLog(db, value + ' templates')
      setTaskIsWorking(false)
      quitLoading()
    }
  }

  const addLog = useCallback((db: string, value: string) => {
    setTimeout(() => {
      props.updateLogs([
        ...(props.logs || []),
        {
          db,
          time: totalSeconds + ' secs.',
          datetime: new Date().toString(),
          event: value
        }
      ])
    }, 700)
  }, [totalSeconds, seconds])

  const handleTruncateEvent = async (db: string) => {
    try {
      setTaskIsWorking(true)
      reset()
      start()
      setLoading()
      await axios.post(db + '/truncate');
    } catch (error) {
      console.log('>>: Error> ', error)
    } finally {
      pause()
      addLog(db, 'Truncate ' + db)
      setTaskIsWorking(false)
      quitLoading()
    }
  }
  const handleSyncEvent = async (db: string) => {
    try {
      setTaskIsWorking(true)
      reset()
      start()
      setLoading()
      await axios.post(db + '/sync');

    } catch (error) {
      console.log('>>: Error> ', error)
    } finally {
      pause()
      addLog(db, 'Sync ' + db)
      setTaskIsWorking(false)
      quitLoading()
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue > 0) {
      setQuantity(newValue)
    }
  }

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: '#7f7f7f;',
          padding: '2%',
          overflow: 'auto',
          height: '93vh'
        }}
      >

        <Grid container spacing={2}>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="d-block">
              <h4>MongoDB</h4>
              <Button
                onClick={() => handleAddEvent('mongodb', quantity)}
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
              >
                +{quantity} Templates
              </Button>
              <Button
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
                onClick={() => handleAddEvent('mongodb', quantity * -1)}
              >
                -{quantity} Templates
              </Button>
              <Button
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
                onClick={() => handleTruncateEvent('mongodb')}
              >
                Truncate Collections
              </Button>
            </div>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="d-block">
              <h4>MySQL</h4>
              <Button
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
                onClick={() => handleAddEvent('mysql', quantity)}
              >
                +{quantity} Templates
              </Button>
              <Button
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
                onClick={() => handleAddEvent('mysql', quantity * -1)}
              >
                -{quantity} Templates
              </Button>
              <Button
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
                onClick={() => handleTruncateEvent('mysql')}
              >
                Truncate Table
              </Button>
              <Button
                disabled={isTaskWorking}
                variant="contained"
                className='d-block'
                onClick={() => handleSyncEvent('mysql')}
              >
                {'Sync MySQL -> MongoDB'}
              </Button>
            </div>
          </Grid>
        </Grid>

        <div style={{ textAlign: 'center' }}>
          <TextField
            label="Templates Quantity"
            variant="outlined"
            value={quantity}
            type='number'
            onChange={handleQuantityChange}
          />
          <p>Time Demo</p>
          <div style={{ fontSize: '100px' }}>
            <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
          <p>{isRunning ? 'Running' : 'Not running'}</p>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Database Type</TableCell>
                <TableCell >Event</TableCell>
                <TableCell >Duration</TableCell>
                <TableCell>Datetime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                props.logs && props.logs.map((element: TemplateLog, i: number) => {
                  return (
                    <TableRow
                      key={i + element.db}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {element.db}
                      </TableCell>
                      <TableCell >{element.event}</TableCell>
                      <TableCell >{element.time}</TableCell>
                      <TableCell >{element.datetime}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
