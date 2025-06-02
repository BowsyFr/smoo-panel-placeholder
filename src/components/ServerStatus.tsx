
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Server, Cpu, HardDrive, Wifi, Users, Play, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServerInfo {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  players: number;
  maxPlayers: number;
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  version: string;
  ip: string;
  port: number;
  lastUpdate: Date;
}

const ServerStatus = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<ServerInfo[]>([
    {
      id: '1',
      name: 'SMOO Server #1',
      status: 'online',
      players: 12,
      maxPlayers: 20,
      cpu: 45,
      memory: 67,
      disk: 23,
      uptime: '3j 14h 22m',
      version: '1.3.0',
      ip: '192.168.1.100',
      port: 1027,
      lastUpdate: new Date(),
    },
    {
      id: '2',
      name: 'SMOO Server #2',
      status: 'online',
      players: 8,
      maxPlayers: 20,
      cpu: 32,
      memory: 54,
      disk: 18,
      uptime: '1j 8h 45m',
      version: '1.3.0',
      ip: '192.168.1.101',
      port: 1028,
      lastUpdate: new Date(),
    },
    {
      id: '3',
      name: 'SMOO Server #3',
      status: 'maintenance',
      players: 0,
      maxPlayers: 20,
      cpu: 0,
      memory: 0,
      disk: 25,
      uptime: '0m',
      version: '1.3.0',
      ip: '192.168.1.102',
      port: 1029,
      lastUpdate: new Date(),
    },
    {
      id: '4',
      name: 'SMOO Server #4',
      status: 'offline',
      players: 0,
      maxPlayers: 20,
      cpu: 0,
      memory: 0,
      disk: 15,
      uptime: '0m',
      version: '1.3.0',
      ip: '192.168.1.103',
      port: 1030,
      lastUpdate: new Date(),
    },
    {
      id: '5',
      name: 'SMOO Server #5',
      status: 'online',
      players: 15,
      maxPlayers: 20,
      cpu: 78,
      memory: 82,
      disk: 31,
      uptime: '5j 2h 10m',
      version: '1.3.0',
      ip: '192.168.1.104',
      port: 1031,
      lastUpdate: new Date(),
    },
  ]);

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(server => ({
        ...server,
        cpu: server.status === 'online' ? Math.max(0, Math.min(100, server.cpu + (Math.random() - 0.5) * 10)) : 0,
        memory: server.status === 'online' ? Math.max(0, Math.min(100, server.memory + (Math.random() - 0.5) * 5)) : 0,
        players: server.status === 'online' ? Math.max(0, Math.min(server.maxPlayers, server.players + Math.floor((Math.random() - 0.5) * 3))) : 0,
        lastUpdate: new Date(),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'offline': return 'Hors ligne';
      case 'maintenance': return 'Maintenance';
      default: return 'Inconnu';
    }
  };

  const handleServerAction = (serverId: string, action: 'start' | 'stop' | 'restart') => {
    setServers(prev => prev.map(server => {
      if (server.id === serverId) {
        switch (action) {
          case 'start':
            return { ...server, status: 'online' as const };
          case 'stop':
            return { ...server, status: 'offline' as const, players: 0, cpu: 0, memory: 0 };
          case 'restart':
            return { ...server, status: 'maintenance' as const, players: 0, cpu: 0, memory: 0 };
        }
      }
      return server;
    }));

    toast({
      title: `Action ${action} exécutée`,
      description: `Serveur ${serverId} - ${action}`,
    });

    // Simuler le redémarrage
    if (action === 'restart') {
      setTimeout(() => {
        setServers(prev => prev.map(server => 
          server.id === serverId ? { ...server, status: 'online' as const } : server
        ));
      }, 3000);
    }
  };

  const overallStats = {
    totalServers: servers.length,
    onlineServers: servers.filter(s => s.status === 'online').length,
    totalPlayers: servers.reduce((sum, s) => sum + s.players, 0),
    avgCpu: Math.round(servers.filter(s => s.status === 'online').reduce((sum, s) => sum + s.cpu, 0) / servers.filter(s => s.status === 'online').length || 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Serveurs en ligne</p>
                <p className="text-2xl font-bold text-white">{overallStats.onlineServers}/{overallStats.totalServers}</p>
              </div>
              <Server className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Joueurs connectés</p>
                <p className="text-2xl font-bold text-white">{overallStats.totalPlayers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">CPU moyen</p>
                <p className="text-2xl font-bold text-white">{overallStats.avgCpu}%</p>
              </div>
              <Cpu className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Statut général</p>
                <p className="text-2xl font-bold text-green-400">Opérationnel</p>
              </div>
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des serveurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{server.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {server.ip}:{server.port} • Version {server.version}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(server.status)}>
                  {getStatusText(server.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Métriques */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Joueurs</span>
                    <span className="text-white">{server.players}/{server.maxPlayers}</span>
                  </div>
                  <Progress 
                    value={(server.players / server.maxPlayers) * 100} 
                    className="mt-1 h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">CPU</span>
                    <span className="text-white">{Math.round(server.cpu)}%</span>
                  </div>
                  <Progress 
                    value={server.cpu} 
                    className="mt-1 h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Mémoire</span>
                    <span className="text-white">{Math.round(server.memory)}%</span>
                  </div>
                  <Progress 
                    value={server.memory} 
                    className="mt-1 h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Disque</span>
                    <span className="text-white">{server.disk}%</span>
                  </div>
                  <Progress 
                    value={server.disk} 
                    className="mt-1 h-2"
                  />
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="text-sm text-gray-400 border-t border-white/10 pt-4">
                <p>Uptime: {server.uptime}</p>
                <p>Dernière mise à jour: {server.lastUpdate.toLocaleTimeString()}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-500/10"
                  onClick={() => handleServerAction(server.id, 'start')}
                  disabled={server.status === 'online'}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Démarrer
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleServerAction(server.id, 'stop')}
                  disabled={server.status === 'offline'}
                >
                  <Square className="w-4 h-4 mr-1" />
                  Arrêter
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                  onClick={() => handleServerAction(server.id, 'restart')}
                  disabled={server.status === 'offline'}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Redémarrer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServerStatus;
