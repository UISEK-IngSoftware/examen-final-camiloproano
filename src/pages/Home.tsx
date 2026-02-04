import { IonAvatar, IonBadge, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './Home.css';

/**
 * Interface del personaje según la API de Futurama
 */
interface Personaje {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  image: string | null;
}

const Home: React.FC = () => {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Consumo de la API al cargar la vista
   */
  useEffect(() => {
    const obtenerPersonajes = async () => {
      try {
        const response = await axios.get(
          'https://futuramaapi.com/api/characters',
          {
            params: {
              orderBy: 'id',
              orderByDirection: 'asc',
              page: 1,
              size: 50
            }
          }
        );

        // Los personajes vienen dentro de response.data.items
        setPersonajes(response.data.items);
      } catch {
        setError('Error al cargar los personajes desde la API.');
      } finally {
        setLoading(false);
      }
    };

    obtenerPersonajes();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Personajes de Futurama</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {/* Estado de carga */}
        <IonLoading isOpen={loading} message="Cargando personajes..." />

        {/* Estado de error */}
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {/* Estado vacío */}
        {!loading && personajes.length === 0 && !error && (
          <IonText>
            <p>No hay personajes para mostrar.</p>
          </IonText>
        )}

        {/* Lista de personajes */}
        <IonList>
          {personajes.map((p) => (
            <IonCard key={p.id} className="personaje-card">
              <IonItem lines="none">
                <IonAvatar slot="start" className="personaje-avatar">
                  <img
                    src={p.image || '/assets/avatar-placeholder.png'}
                    alt={p.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/avatar-placeholder.png';
                    }}
                  />
                </IonAvatar>

                <IonLabel>
                  <h2>{p.name}</h2>

                  <div className="badges">
                    <IonBadge color="secondary">{p.gender}</IonBadge>
                    <IonBadge
                      color={p.status === 'ALIVE' ? 'success' : 'medium'}
                    >
                      {p.status}
                    </IonBadge>
                  </div>
                </IonLabel>
              </IonItem>

              <IonCardContent>
                <IonText color="medium">
                  Especie: {p.species}
                </IonText>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
