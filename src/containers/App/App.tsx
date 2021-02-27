import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Navigation from '../Navigation/Navigation';
import { TPlayers, IAddons } from '../../types';
import ROUTES, { RenderRoutes } from '../../config/routes';
import {
  savePlayersToStorage,
  saveAddonsToStorage,
  getPlayersFromStorage,
  getAddonsFromStorage,
} from '../../utils/storage';
import playersReducer, { TAction as TPlayersAction } from '../../reducers/players';
import addonsReducer, { TAction as TAddonsAction, addonsTemplate } from '../../reducers/addons';
import Layout from '../../components/Layout/Layout';
import RouteWrapper from '../../components/RouteWrapper/RouteWrapper';
import MainMenu from '../MainMenu/MainMenu';

interface IPlayersContextProps {
  state: TPlayers;
  dispatch: (action: TPlayersAction) => void;
}

interface IAddonsContextProps {
  state: IAddons;
  dispatch: (action: TAddonsAction) => void;
}

export const PlayersContext = React.createContext({} as IPlayersContextProps);
export const AddonsContext = React.createContext({} as IAddonsContextProps);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [players, playersDispatch] = useReducer(playersReducer, []);
  const [addons, addonsDispatch] = useReducer(addonsReducer, addonsTemplate);

  useEffect(() => {
    savePlayersToStorage(players);
  }, [players]);

  useEffect(() => {
    saveAddonsToStorage(addons);
  }, [addons]);

  useEffect(() => {
    restoreGame();
  }, []);

  useEffect(() => {
    playersDispatch({ type: 'SET_ADDON', payload: addons });
  }, [addons]);

  function restoreGame(): void {
    playersDispatch({ type: 'SET', payload: getPlayersFromStorage() });
    addonsDispatch({ type: 'SET', payload: getAddonsFromStorage() });
    setIsReady(true);
  }

  return (
    <div className="App">
      <PlayersContext.Provider value={{ state: players, dispatch: playersDispatch }}>
        <AddonsContext.Provider value={{ state: addons, dispatch: addonsDispatch }}>
          {isReady && (
            <Layout>
              <>
                <Navigation routes={ROUTES} players={players} addons={addons} />
                <MainMenu />
                <RouteWrapper>
                  <RenderRoutes routes={ROUTES} players={players} addons={addons} />
                </RouteWrapper>
              </>
            </Layout>
          )}
        </AddonsContext.Provider>
      </PlayersContext.Provider>
    </div>
  );
}
