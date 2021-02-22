import * as React from 'react';
import { TPlayers, IRoute, IScore } from '../../types';
import { getTotal } from '../../utils/score';
import { useState, useEffect, useContext } from 'react';
import { AddonsContext, PlayersContext } from '../App/App';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ScoreRoutes } from '../../config/routes';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  head: {
    backgroundColor: '#eee',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  scoresHead: {
    textAlign: 'center',
  },
  score: {
    color: '#FFF',
    textAlign: 'center',
  },
  sum: {
    textAlign: 'center',
  },
  medal: {
    fontSize: '1.5em',
    lineHeight: 0,
    paddingRight: 0,
  },
});

export default function Total() {
  const playersContext = useContext(PlayersContext);
  const addonsContext = useContext(AddonsContext);

  const classes = useStyles();

  const [winner, setWinner] = useState('');
  useEffect(() => {
    setWinner(getWinner(playersContext.state));
  }, [playersContext.state]);

  function getWinner(players: TPlayers): string {
    const bestPlayer = players.reduce(
      (acc, player) => {
        const playerSum = getTotal(player.score);

        if (acc.name === '' || playerSum > acc.score) {
          acc = {
            name: player.name,
            score: playerSum,
          };
        }
        return acc;
      },
      { name: '', score: 0 }
    );

    return bestPlayer ? bestPlayer.name : '';
  }

  function isScoreRouteAvailable(route: IRoute) {
    return (
      route.available &&
      route.available({
        players: playersContext.state,
        addons: addonsContext.state,
      })
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell />
            <TableCell className={classes.headerCell}>Игрок</TableCell>
            <TableCell
              className={`${classes.headerCell} ${classes.scoresHead}`}
              colSpan={
                ScoreRoutes.filter(
                  route =>
                    route.available &&
                    route.available({
                      players: playersContext.state,
                      addons: addonsContext.state,
                    })
                ).length
              }
            >
              Очки
            </TableCell>
            <TableCell className={`${classes.headerCell} ${classes.scoresHead}`}>Σ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playersContext.state.map((player, index) => (
            <TableRow key={index}>
              <TableCell className={classes.medal}>{winner === player.name ? '🏆' : ''}</TableCell>
              <TableCell>
                <Typography variant="body2">{player.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {player.wonder}
                </Typography>
              </TableCell>
              {ScoreRoutes.map(
                route =>
                  isScoreRouteAvailable(route) && (
                    <TableCell
                      key={route.key}
                      className={classes.score}
                      style={{ backgroundColor: route.color }}
                    >
                      {route.sum
                        ? route.sum(player.score)
                        : player.score[route.key as keyof IScore]}
                    </TableCell>
                  )
              )}
              <TableCell className={classes.sum}>{getTotal(player.score)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
