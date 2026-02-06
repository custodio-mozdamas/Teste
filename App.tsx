
import React, { useState, useEffect } from 'react';
import { AppTab, User, Room, GameStatus, RoomType, PieceColor, BoardTheme } from './types';
import Navigation from './components/Navigation';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import { supabase } from './services/supabase';
import { User as UserIcon, LogOut, BarChart3, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    initAuth();
    fetchRooms();
    
    // Inscrição em tempo real para salas
    const roomsSubscription = supabase
      .channel('rooms_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      roomsSubscription.unsubscribe();
    };
  }, []);

  const initAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setCurrentUser(profile);
    } else {
      // Simulação de login anônimo ou persistência local para este protótipo
      const guestId = localStorage.getItem('guest_id') || Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guest_id', guestId);
      setCurrentUser({
        id: guestId,
        name: 'Player_' + guestId.substr(0, 4),
        avatar: `https://picsum.photos/seed/${guestId}/200`,
        rating: 1200,
        matches: 0,
        wins: 0
      });
    }
  };

  const fetchRooms = async () => {
    const { data } = await supabase.from('rooms').select('*').eq('status', 'WAITING');
    if (data) setRooms(data as any);
  };

  const handleJoinRoom = async (room: Room) => {
    setActiveRoom(room);
    setActiveTab(AppTab.GAME);
  };

  const handleCreateRoom = async (params: any) => {
    const { data, error } = await supabase.from('rooms').insert([{
      name: params.name,
      type: params.type,
      config: { 
        timeLimit: params.timeLimit, 
        increment: params.increment, 
        theme: params.theme 
      },
      created_by: currentUser?.id
    }]).select().single();

    if (data) {
      handleJoinRoom(data as any);
    }
  };

  const handleExitClick = () => {
    if (activeRoom) setShowExitModal(true);
    else setActiveTab(AppTab.HOME);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505]">
      <main className="flex-1 overflow-hidden">
        {activeTab === AppTab.HOME && !activeRoom && (
          <Lobby rooms={rooms} onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
        )}

        {activeTab === AppTab.GAME && activeRoom && (
          <GameView 
            room={activeRoom} 
            currentUser={currentUser} 
            onExit={() => setShowExitModal(true)}
            onRestart={() => {}} 
          />
        )}

        {activeTab === AppTab.RANKING && (
          <div className="p-6 pb-24 space-y-6 overflow-y-auto h-full">
            <h1 className="text-3xl font-black neon-glow italic uppercase tracking-tighter">Ranking Mundial</h1>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#0d0d0d] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-black text-[#39ff14] w-8">#{i}</span>
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <span className="font-bold">ProPlayer_{i}</span>
                  </div>
                  <span className="text-[#39ff14] font-mono">1{400 - i * 50}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === AppTab.PROFILE && currentUser && (
          <div className="p-6 pb-24 space-y-8 overflow-y-auto h-full">
            <div className="flex flex-col items-center space-y-4 pt-10">
              <img src={currentUser.avatar} className="w-32 h-32 rounded-full border-4 border-[#39ff14] shadow-[0_0_30px_rgba(57,255,20,0.3)]" />
              <div className="text-center">
                <h2 className="text-3xl font-black">{currentUser.name}</h2>
                <p className="text-[#39ff14] font-mono font-bold tracking-widest">ELO: {currentUser.rating}</p>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="w-full bg-red-900/20 text-red-500 p-5 rounded-2xl font-bold border border-red-500/20 flex items-center justify-center space-x-2">
              <LogOut className="w-5 h-5" /> <span>Encerrar Sessão</span>
            </button>
          </div>
        )}
      </main>

      {!activeRoom && <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />}

      {showExitModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
           <div className="bg-[#0d0d0d] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-10 text-center space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                 <LogOut className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black uppercase italic">Abandonar?</h3>
                 <p className="text-gray-400 font-medium">Você perderá pontos de rating e a partida será declarada derrota.</p>
              </div>
              <div className="flex flex-col space-y-3">
                 <button onClick={() => { setActiveRoom(null); setShowExitModal(false); setActiveTab(AppTab.HOME); }} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-[0_10px_40px_rgba(220,38,38,0.3)]">CONFIRMAR SAÍDA</button>
                 <button onClick={() => setShowExitModal(false)} className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl font-bold">VOLTAR AO JOGO</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
