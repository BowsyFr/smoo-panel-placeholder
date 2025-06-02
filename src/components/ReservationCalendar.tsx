
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addDays, format, isWithinInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReservationCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const { toast } = useToast();

  // Données simulées des réservations existantes
  const existingReservations = [
    { 
      dates: [new Date(2024, 5, 10), new Date(2024, 5, 11)], 
      server: 'Serveur #1',
      user: 'Player123'
    },
    { 
      dates: [new Date(2024, 5, 15)], 
      server: 'Serveur #3',
      user: 'GamerPro'
    },
  ];

  const servers = [
    { id: '1', name: 'Serveur #1', status: 'occupé' },
    { id: '2', name: 'Serveur #2', status: 'disponible' },
    { id: '3', name: 'Serveur #3', status: 'occupé' },
    { id: '4', name: 'Serveur #4', status: 'disponible' },
    { id: '5', name: 'Serveur #5', status: 'disponible' },
  ];

  const isDateReserved = (date: Date) => {
    return existingReservations.some(reservation =>
      reservation.dates.some(resDate => isSameDay(resDate, date))
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Vérifier si la date est déjà réservée
    if (isDateReserved(date)) {
      toast({
        title: "Date non disponible",
        description: "Cette date est déjà réservée par un autre utilisateur.",
        variant: "destructive",
      });
      return;
    }

    setSelectedDates(prev => {
      const newDates = [...prev];
      const dateIndex = newDates.findIndex(d => isSameDay(d, date));
      
      if (dateIndex > -1) {
        // Retirer la date si elle est déjà sélectionnée
        newDates.splice(dateIndex, 1);
      } else {
        // Ajouter la date si moins de 3 jours sélectionnés
        if (newDates.length < 3) {
          newDates.push(date);
          newDates.sort((a, b) => a.getTime() - b.getTime());
        } else {
          toast({
            title: "Limite atteinte",
            description: "Vous ne pouvez réserver que 3 jours maximum.",
            variant: "destructive",
          });
        }
      }
      
      return newDates;
    });
  };

  const handleReservation = () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Aucune date sélectionnée",
        description: "Veuillez sélectionner au moins une date.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedServer) {
      toast({
        title: "Aucun serveur sélectionné",
        description: "Veuillez choisir un serveur.",
        variant: "destructive",
      });
      return;
    }

    // Simuler la réservation
    toast({
      title: "Réservation confirmée !",
      description: `${selectedServer} réservé pour ${selectedDates.length} jour(s).`,
    });

    // Reset
    setSelectedDates([]);
    setSelectedServer('');
  };

  const modifiers = {
    selected: selectedDates,
    reserved: existingReservations.flatMap(res => res.dates),
  };

  const modifiersStyles = {
    selected: {
      backgroundColor: '#06b6d4',
      color: 'white',
    },
    reserved: {
      backgroundColor: '#ef4444',
      color: 'white',
      opacity: 0.7,
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendrier */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Calendrier de réservation</CardTitle>
            <CardDescription className="text-gray-400">
              Sélectionnez jusqu'à 3 jours pour votre réservation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDates[0]}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              locale={fr}
              className="rounded-md border border-white/20 bg-white/5 text-white p-3 pointer-events-auto"
              disabled={(date) => date < new Date()}
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <span className="text-sm text-gray-300">Dates sélectionnées</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded opacity-70"></div>
                <span className="text-sm text-gray-300">Dates réservées</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection du serveur et confirmation */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Configuration de la réservation</CardTitle>
            <CardDescription className="text-gray-400">
              Choisissez votre serveur et confirmez votre réservation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dates sélectionnées */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Dates sélectionnées</h4>
              <div className="space-y-2">
                {selectedDates.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune date sélectionnée</p>
                ) : (
                  selectedDates.map((date, index) => (
                    <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                      {format(date, 'dd MMMM yyyy', { locale: fr })}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Sélection du serveur */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Serveur</h4>
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choisir un serveur" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {servers
                    .filter(server => server.status === 'disponible')
                    .map((server) => (
                      <SelectItem 
                        key={server.id} 
                        value={server.name}
                        className="text-white hover:bg-white/10"
                      >
                        {server.name} - {server.status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Récapitulatif */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-sm font-medium text-white mb-2">Récapitulatif</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Durée: {selectedDates.length} jour(s)</p>
                <p>Serveur: {selectedServer || 'Non sélectionné'}</p>
                <p>Coût: Gratuit</p>
              </div>
            </div>

            <Button
              onClick={handleReservation}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              disabled={selectedDates.length === 0 || !selectedServer}
            >
              Confirmer la réservation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* État des serveurs */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">État des serveurs</CardTitle>
          <CardDescription className="text-gray-400">
            Disponibilité en temps réel de tous les serveurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {servers.map((server) => (
              <Card key={server.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium text-white">{server.name}</h4>
                  <Badge 
                    className={
                      server.status === 'disponible' 
                        ? 'bg-green-500 mt-2' 
                        : 'bg-red-500 mt-2'
                    }
                  >
                    {server.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationCalendar;
