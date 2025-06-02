
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Server, Users, Clock, LogOut, Settings } from 'lucide-react';
import ReservationCalendar from './ReservationCalendar';
import ServerStatus from './ServerStatus';

interface User {
  id: string;
  username: string;
  email: string;
  reservations: any[];
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: "Réservations actives",
      value: "2",
      description: "Serveurs réservés",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Serveurs disponibles",
      value: "3/5",
      description: "Serveurs libres",
      icon: Server,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Temps restant",
      value: "47h",
      description: "Sur votre réservation",
      icon: Clock,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Utilisateurs en ligne",
      value: "127",
      description: "Connectés maintenant",
      icon: Users,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Panel SMOO</h1>
                <p className="text-sm text-gray-400">Bienvenue, {user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Calendar },
              { id: 'calendar', label: 'Réservations', icon: Calendar },
              { id: 'servers', label: 'Serveurs', icon: Server },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Actions rapides</CardTitle>
                <CardDescription className="text-gray-400">
                  Gérez vos réservations et serveurs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('calendar')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Nouvelle réservation
                  </Button>
                  <Button
                    onClick={() => setActiveTab('servers')}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Server className="w-4 h-4 mr-2" />
                    État des serveurs
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Voir les logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Réservation créée", server: "Serveur #3", time: "Il y a 2h", status: "success" },
                    { action: "Connexion", server: "Serveur #1", time: "Il y a 4h", status: "info" },
                    { action: "Réservation terminée", server: "Serveur #2", time: "Il y a 1j", status: "warning" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={activity.status === 'success' ? 'default' : 'secondary'}
                          className={
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'info' ? 'bg-blue-500' : 'bg-orange-500'
                          }
                        >
                          {activity.action}
                        </Badge>
                        <span className="text-white">{activity.server}</span>
                      </div>
                      <span className="text-sm text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'calendar' && <ReservationCalendar />}
        {activeTab === 'servers' && <ServerStatus />}
      </main>
    </div>
  );
};

export default Dashboard;
