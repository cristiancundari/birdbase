# Caso d'uso: Login

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore o Amministratore |
| **Descrizione** | L'allevatore o l'Amministratore accede all'applicazione inserendo le proprie credenziali. |
| **Precondizioni** | - L'utente ha accesso a Internet. <br> - L'utente è già registrato nel sistema con un nome utente e una password validi. |
| **Postcondizioni** | - L'utente è autenticato e ha accesso alla dashboard dell'applicazione. <br> - Se le credenziali sono errate, viene mostrato un messaggio di errore. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'utente apre l'applicazione sul dispositivo. <br> 2. L'utente inserisce la propria e-mail. <br> 3. L'utente inserisce la propria password. <br> 4. L'utente preme il pulsante "Accedi". <br> 5. Il sistema verifica le credenziali. <br> 6. Se le credenziali sono corrette, il sistema verifica il ruolo dell'utente reindirizzandolo alla relativa pagina dell'applicazione <br> 7. Se le credenziali sono errate, il sistema mostra un messaggio di errore e permette all'utente di riprovare. |

---

# Casi d'uso: Gestire le finanze

## 1. Visualizzare le transazioni

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare un elenco di tutte le transazioni di spesa e incasso, suddivise per categorie (Gabbie, Uccelli, Mangime, Medicine, Altro). |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova nella pagina "Portafoglio". <br> - L'allevatore ha effettuato delle transazioni precedenti. |
| **Postcondizioni** | - L'allevatore visualizza una lista delle transazioni, ordinate per data. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. Il sistema carica e visualizza un elenco di transazioni suddivise per categoria. <br> 2. L'allevatore può scorrere l'elenco e visualizzare il dettaglio di ogni transazione. |

## 2. Aggiungere, modificare o eliminare transazioni

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può aggiungere nuove transazioni di spesa o incasso, oppure modificare o eliminare quelle già esistenti. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova nella pagina "Portafoglio". |
| **Postcondizioni** | - Il sistema aggiorna correttamente l'elenco delle transazioni. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona l'opzione "Aggiungi transazione" per creare una nuova voce di spesa/incasso o seleziona una transazione esistente per modificarla o eliminarla. <br> 2. Se aggiunge una nuova transazione, l'allevatore inserisce i dettagli (importo, categoria, descrizione, data). <br> 3. Il sistema salva la nuova transazione o aggiorna quella esistente. <br> 4. Se l'allevatore elimina una transazione, il sistema la rimuove dall'elenco. <br> 5. Il sistema mostra un messaggio per notificare evetuali errori o il corretto salvataggio della transazione |

## 3. Visualizzare il grafico delle spese annuali

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare un grafico a torta che mostra la suddivisione delle spese per categoria nell'anno selezionato. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova nella pagina "Portafoglio". <br> - Esistono transazioni di spesa registrate per l'anno selezionato. |
| **Postcondizioni** | - Il sistema visualizza un grafico a torta con la suddivisione delle spese annuali per categoria. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un anno dal menu a tendina. <br> 2. Il sistema carica il grafico a torta, visualizzando le spese annuali suddivise per categoria. |

## 4. Visualizzare gli incassi mensili

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare un grafico a barre (istogramma) che mostra gli incassi mensili dell'anno selezionato. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova nella pagina "Portafoglio". <br> - Esistono transazioni di incasso registrate per l'anno selezionato. |
| **Postcondizioni** | - Il sistema visualizza un grafico a barre che mostra gli incassi mensili dell'anno selezionato. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un anno dal menu a tendina. <br> 2. Il sistema carica un grafico a barre che mostra gli incassi mensili dell'anno selezionato. |

## 5. Impostare il budget mensile

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può impostare un budget mensile per tenere sotto controllo le proprie spese. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova nella pagina "Portafoglio". |
| **Postcondizioni** | - Il sistema memorizza il budget mensile e calcola il bilancio attuale (spese vs incassi). |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona l'opzione "Imposta budget". <br> 2. L'allevatore inserisce un valore per il budget mensile. <br> 3. Il sistema memorizza il budget e visualizza il bilancio attuale, confrontando le spese e gli incassi con il budget. |

## 6. Genera report di un arco temporale

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può generare un report personalizzato delle transazioni di spesa, incasso o entrambe per un intervallo di date scelto (personalizzato o predefinito: "Ultimo mese", "Ultimi tre mesi", "Ultimi sei mesi"). Il report viene generato e reso disponibile per la stampa. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova nella pagina "Portafoglio". |
| **Postcondizioni** | - Il sistema genera il report richiesto e lo rende disponibile per la stampa. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona l'opzione "Genera report" tramite il pulsante dedicato. <br> 2. L'allevatore sceglie il tipo di report: spese, incassi o tutte le transazioni. <br> 3. L'allevatore seleziona l'intervallo di date personalizzato oppure uno degli intervalli predefiniti ("Ultimo mese", "Ultimi tre mesi", "Ultimi sei mesi"). <br> 4. L'allevatore conferma la selezione. <br> 5. Il sistema elabora i dati e genera il report in una nuova pagina. <br> 6. L'allevatore può stampare il report. |

---

# Casi d'uso: Gestire i soggetti

## 1. Aggiungere un soggetto

| **Sezione** | **Descrizione** |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può aggiungere un nuovo soggetto inserendo le informazioni relative. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore ha accesso alla gestione dei soggetti. |
| **Postcondizioni** | - Il soggetto viene salvato nel database e appare nella lista dei soggetti. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore clicca sul pulsante "Aggiungi". <br> 2. Si apre una finestra modale con un modulo per l'inserimento dei dati del soggetto. <br> 3. L'allevatore inserisce i dati richiesti. <br> 4. L'allevatore clicca il pulsante "Salva". <br> 5. Il sistema salva il soggetto nel database. <br> 6. Il soggetto viene visualizzato nella lista dei soggetti. |

## 2. Modificare un soggetto

| **Sezione** | **Descrizione** |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può modificare i dati di un soggetto esistente. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore ha accesso alla gestione dei soggetti. <br> - Il soggetto esiste già nel sistema. |
| **Postcondizioni** | - I dati del soggetto vengono aggiornati nel database. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona il soggetto da modificare dalla lista. <br> 2. Clicca sul pulsante "Modifica". <br> 3. Si apre una finestra modale con il modulo precompilato con i dati attuali del soggetto. <br> 4. L'allevatore modifica i dati che desidera. <br> 5. L'allevatore clicca su "Salva" per confermare le modifiche. <br> 6. Il sistema aggiorna i dati nel database. <br> 7. Il soggetto modificato viene aggiornato nella lista dei soggetti. |

## 3. Eliminare un soggetto

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può eliminare un soggetto esistente. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore ha accesso alla gestione dei soggetti. <br> - Il soggetto esiste già nel sistema. |
| **Postcondizioni** | - Il soggetto viene rimosso dal database e non appare più nella lista dei soggetti. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona il soggetto da eliminare dalla lista. <br> 2. Clicca sul pulsante "Elimina". <br> 3. Si apre una finestra modale che chiede conferma dell'azione. <br> 4. Se l'allevatore conferma l'azione, il sistema rimuove il soggetto dal database. <br> 5. Il soggetto viene rimosso dalla lista dei soggetti. |

## 4. Contrassegnare come preferito

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può contrassegnare un soggetto come preferito per evidenziarlo. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore ha accesso alla gestione dei soggetti. <br> - Il soggetto esiste già nel sistema. |
| **Postcondizioni** | - Il soggetto viene contrassegnato come preferito. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un soggetto dalla lista. <br> 2. Clicca sull'icona a forma di cuore accanto al soggetto. <br> 3. Il sistema salva lo stato preferito del soggetto nel database. <br> 4. Il sistema aggiorna l'icona per riflettere lo stato attuale |

---

# Casi d'uso: Gestire le covate

## 1. Aggiungere una covata

| **Sezione** | **Descrizione** |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può aggiungere una nuova covata. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova sulla pagina "Covate". |
| **Postcondizioni** | - La covata viene aggiunta al database e appare nella lista delle covate. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore clicca sul pulsante "Aggiungi". <br> 2. Si apre una finestra modale in cui l'allevatore seleziona il padre (o la madre) dalla lista di soggetti. <br> 3. Il sistema calcola automaticamente le parentele tra il padre (o la madre) e tutte le femmine (o i maschi) disponibili e mostra il risultato all'allevatore. <br> 4. L'allevatore inserisce gli altri dati richiesti nel modulo. <br> 5. L'allevatore clicca su "Salva" per aggiungere la covata al database. <br> 6. La covata viene visualizzata nella lista delle covate. |

## 2. Modificare una covata

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può modificare una covata esistente. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova sulla pagina "Covate". <br> - La covata esiste già nel sistema. |
| **Postcondizioni** | - I dati della covata vengono aggiornati nel database. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una covata dalla lista. <br> 2. Clicca sul pulsante "Modifica". <br> 3. Si apre una finestra modale con il modulo precompilato con i dati attuali della covata. <br> 4. L'allevatore modifica i dati desiderati. <br> 5. L'allevatore clicca su "Salva" per aggiornare la covata. <br> 6. Il sistema aggiorna i dati nel database. <br> 7. La covata modificata viene aggiornata nella lista delle covate. |

## 3. Eliminare una covata

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può eliminare una covata, ma solo se non ha figli associati. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova sulla pagina "Covate". <br> - La covata esiste già nel sistema. |
| **Postcondizioni** | - La covata viene eliminata dal database e non appare più nella lista delle covate. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una covata dalla lista. <br> 2. Clicca sul pulsante "Elimina". <br> 3. Il sistema chiede conferma dell'azione. <br> 4. L'allevatore conferma l'azione. <br> 5. Se la covata ha figli, il sistema mostra un messaggio di errore e impedisce l'eliminazione altrimenti rimuove la covata dal database. <br> 6. La covata viene eliminata dalla lista delle covate. |

## 4. Visualizzare informazioni della covata e aggiungere figli

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L’allevatore può visualizzare i dettagli di una covata e aggiungere i figli a quella covata. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova sulla pagina "Covate". <br> - La covata esiste già nel sistema. |
| **Postcondizioni** | - I figli vengono aggiunti alla covata e il sistema aggiorna la lista dei figli. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una covata dalla lista e clicca su di essa per visualizzarne i dettagli. <br> 2. Sulla pagina della covata, l'allevatore vede tutte le informazioni relative alla covata. <br> 3. L'allevatore clicca sul pulsante "Aggiungi" per inserire un nuovo figlio. <br> 4. L'allevatore ha due opzioni: <br> &nbsp;&nbsp;&nbsp;&nbsp; - Creare un nuovo soggetto inserendo tutti i dati richiesti. <br> &nbsp;&nbsp;&nbsp;&nbsp; - Selezionare un soggetto già esistente nel database. <br> 5. Una volta selezionato o creato il figlio, l'allevatore conferma l'azione e il sistema aggiunge il figlio alla covata. <br> 6. Il sistema aggiorna la visualizzazione della covata con i nuovi figli aggiunti. |

## 5. Rimuovere un figlio da una covata

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può rimuovere un soggetto dalla lista dei figli di una covata. |
| **Precondizioni** | - L'allevatore è autenticato. <br> - L'allevatore si trova sulla pagina "Covate". <br> - La covata esiste e contiene già uno o più figli. <br> - Il figlio che si vuole rimuovere è già stato aggiunto alla covata. |
| **Postcondizioni** | - Il soggetto viene rimosso dalla covata. <br> - La lista dei figli della covata viene aggiornata. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una covata dalla lista e clicca su di essa per visualizzarne i dettagli. <br> 2. Sulla pagina della covata, l'allevatore vede l'elenco dei figli associati. <br> 3. L'allevatore seleziona il figlio che vuole rimuovere dalla covata. <br> 4. L'allevatore clicca sul pulsante "Rimuovi". <br> 5. Il sistema rimuove il figlio dalla covata senza eliminarlo dal sistema. <br> 6. Il sistema aggiorna la lista dei figli della covata, rimuovendo il soggetto selezionato. |

---

# Casi d'uso: Gestire i promemoria

## 1. Visualizzare il calendario dei promemoria

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare un calendario con i giorni evidenziati in cui sono presenti dei promemoria. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Promemoria". |
| **Postcondizioni** | - Il sistema visualizza il calendario con i promemoria evidenziati. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. Il sistema mostra il calendario con i giorni in cui sono presenti promemoria. <br> 2. Il sistema mostra i promemoria relativi al giorno selezionato |

## 2. Creare un nuovo promemoria

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può creare un nuovo promemoria selezionando data, ora e un titolo. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Promemoria". |
| **Postcondizioni** | - Il sistema salva il nuovo promemoria e aggiorna il calendario. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una data e un'ora per il nuovo promemoria. <br> 2. L'allevatore inserisce un titolo e sceglie la priorità per il promemoria. <br> 3. L'allevatore clicca "Salva". <br> 4. Il sistema salva il promemoria e aggiorna il calendario. |

## 3. Modificare un promemoria esistente

| **Sezione** | **Descrizione** |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può modificare un promemoria esistente. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Promemoria". <br> - Esiste un promemoria da modificare. |
| **Postcondizioni** | - Il sistema aggiorna il promemoria e aggiorna il calendario. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un promemoria esistente. <br> 2. L'allevatore modifica le informazioni desiderate del promemoria. <br> 3. L'allevatore clicca "Salva". <br> 4. Il sistema aggiorna il promemoria e il calendario. |

## 4. Eliminare un promemoria

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può eliminare un promemoria esistente. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Promemoria". <br> - Esiste un promemoria da eliminare. |
| **Postcondizioni** | - Il sistema elimina il promemoria e aggiorna il calendario. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un promemoria esistente. <br> 2. L'allevatore preme "Elimina". <br> 3. Il sistema elimina il promemoria e aggiorna il calendario. |

## 5. Sincronizzare i promemoria con Google Calendar

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | Se l'allevatore ha collegato il proprio account Google, i promemoria vengono sincronizzati anche con Google Calendar. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Promemoria". <br> - L'allevatore ha collegato il proprio account Google all'applicazione. |
| **Postcondizioni** | - I promemoria vengono creati, modificati o eliminati anche in Google Calendar. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore crea, modifica o elimina un promemoria. <br> 2. Se l'account Google è collegato, il promemoria viene sincronizzato automaticamente con Google Calendar. |

---

# Caso d'uso: Configurare connessione con Google Calendar

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può collegare il proprio account Google per consentire la sincronizzazione dei promemoria con Google Calendar. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Impostazioni". |
| **Postcondizioni** | - L'account Google dell'allevatore è associato al sistema per la sincronizzazione dei promemoria. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore clicca sul bottone "Link Google Calendar". <br> 2. Il sistema apre in una nuova finestra il form di login di Google. <br> 3. L'allevatore si autentica tramite le proprie credenziali Google. <br> 4. Il sistema completa l'associazione dell'account Google. <br> 5. Il sistema mostra un messaggio di avvenuta associazione e disabilita il bottone di connessione. |

---

# Casi d'uso: Visualizzare gare

## 1. Visualizzare la lista delle gare

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore, una volta effettuato l'accesso e cliccato sulla sezione "Gare", può visualizzare una lista delle gare disponibili. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella sezione "Gare". <br> - Esiste almeno una gara disponibile. |
| **Postcondizioni** | - L'allevatore visualizza la lista delle gare disponibili. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore accede alla sezione "Gare". <br> 2. Il sistema mostra la lista delle gare disponibili. |

## 2. Visualizzare i dettagli di una gara

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare i dettagli di una gara selezionata cliccando sul pulsante "Visualizza" accanto alla gara. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella sezione "Gare". <br> - L'allevatore ha selezionato una gara dalla lista. |
| **Postcondizioni** | - L'allevatore visualizza i commenti relativi alla gara e, se la gara è completata, la classifica generale e quella dei suoi soggetti. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una gara dalla lista. <br> 2. L'allevatore preme il pulsante "Visualizza". <br> 3. Il sistema mostra i commenti relativi alla gara. <br> 4. Se la gara è completata, il sistema mostra la classifica generale e quella dei soggetti dell'allevatore. |

## 3. Visualizzare i commenti di una gara

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare i commenti relativi a una gara, che sono visibili nella sezione dei dettagli della gara. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella sezione "Gare" e ha selezionato una gara. |
| **Postcondizioni** | - L'allevatore visualizza i commenti relativi alla gara selezionata. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una gara dalla lista. <br> 2. Il sistema mostra i commenti relativi alla gara. |

## 4. Visualizzare la classifica di una gara completata

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | Se la gara è completata, l'allevatore può visualizzare la classifica generale e quella dei suoi soggetti. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella sezione "Gare" e ha selezionato una gara completata. |
| **Postcondizioni** | - L'allevatore visualizza la classifica generale della gara e quella dei suoi soggetti, se disponibile. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona una gara completata dalla lista. <br> 2. Il sistema mostra la classifica generale. <br> 3. Il sistema mostra la classifica dei soggetti dell'allevatore, se applicabile. |

## 5. Condividere sui social i soggetti classificati

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può condividere sui social i soggetti che hanno ottenuto una posizione in gara. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore ha visualizzato la classifica di una gara e ha ottenuto un soggetto classificato. |
| **Postcondizioni** | - Il soggetto selezionato viene condiviso sui social scelti. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un soggetto dalla classifica della gara. <br> 2. L'allevatore preme "Condividi". <br> 3. Il sistema consente all'allevatore di scegliere il social e inviare il post. |

---

# Casi d'uso: Iscrivi uccelli alle gare

## 1. Selezionare i soggetti da iscrivere

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore seleziona la gara alla quale desidera iscrivere il proprio soggetto. Successivamente, l'allevatore clicca sul pulsante "Iscrivi" e seleziona i soggetti da iscrivere. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina della gara selezionata. <br> - L'allevatore ha almeno un soggetto registrato. |
| **Postcondizioni** | - I soggetti desiderati vengono aggiunti al carrello. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore clicca sul pulsante "Iscrivi". <br> 3. Il sistema mostra una lista di soggetti. <br> 4. L'allevatore seleziona il soggetto da iscrivere e clicca su "Seleziona". <br> 5. Il sistema aggiunge il soggetto al carrello. <br> 6. L'allevatore può aggiungere ulteriori soggetti al carrello. <br> 7. Il sistema mostra l'elenco dei soggetti iscritti e il totale da pagare. |

## 2. Effettuare il pagamento tramite PayPal

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore effettua il pagamento tramite PayPal. |
| **Precondizioni** | - I soggetti da iscrivere sono stati aggiunti al carrello e il totale è stato visualizzato. <br> - L'allevatore ha un account PayPal attivo. |
| **Postcondizioni** | - Il pagamento è stato effettuato con successo tramite PayPal. <br> - L'iscrizione alla gara è stata completata. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore visualizza il totale nel carrello. <br> 2. L'allevatore clicca sul pulsante PayPal per procedere con il pagamento. <br> 3. Il sistema reindirizza l'allevatore alla pagina di PayPal. <br> 4. L'allevatore effettua l'accesso al proprio account PayPal. <br> 5. Il sistema conferma il pagamento e l'iscrizione alla gara. |

---

# Casi d'uso: Gestire annunci

## 1. Creare un annuncio di vendita

| **Sezione** | **Descrizione** |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può creare un annuncio di vendita di un soggetto tramite la pagina "Marketplace". |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Marketplace". |
| **Postcondizioni** | - Il nuovo annuncio è visibile nel marketplace. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore clicca sul pulsante "Aggiungi". <br> 2. Il sistema apre un modal per creare un nuovo annuncio. <br> 3. L'allevatore seleziona il soggetto da mettere in vendita. <br> 4. L'allevatore scrive una breve descrizione e assegna un prezzo al soggetto. <br> 5. L'allevatore conferma la creazione dell'annuncio. <br> 6. Il sistema aggiunge l'annuncio alla lista degli annunci di vendita. |

## 2. Modificare un annuncio di vendita

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può modificare un annuncio di vendita già esistente. |
| **Precondizioni** | - L'allevatore si trova nella pagina "Marketplace". <br> - L'allevatore ha creato almeno un annuncio di vendita. |
| **Postcondizioni** | - L'annuncio viene aggiornato con le nuove informazioni. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona un proprio annuncio esistente. <br> 2. Il sistema apre il modal per modificare l'annuncio. <br> 3. L'allevatore modifica le informazioni del soggetto, la descrizione o il prezzo. <br> 4. L'allevatore conferma le modifiche. <br> 5. Il sistema aggiorna l'annuncio. |

## 3. Visualizzare un annuncio e acquistare un soggetto

| **Sezione** | **Descrizione** |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può visualizzare gli annunci di vendita e acquistare un soggetto di interesse. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Marketplace". |
| **Postcondizioni** | - L'allevatore ha acquistato un soggetto, che appare nel proprio inventario. <br> - L'annuncio non è più visibile. <br> - Le transazioni di spesa e incasso vengono aggiunte ai portafogli dei due allevatori coinvolti. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore visualizza la lista degli annunci di vendita. <br> 2. Il sistema mostra i dettagli dell'annuncio, tra cui le informazioni sul soggetto e le sue performance nelle gare/mostre. <br> 3. L'allevatore clicca sul pulsante "PayPal". <br> 4. Il sistema apre una finestra di PayPal per completare l'acquisto. <br> 5. L'allevatore finalizza il pagamento tramite PayPal. <br> 6. Il sistema aggiorna la lista degli annunci, rimuovendo l'annuncio acquistato. <br> 7. Il sistema crea le relative voci di spese e incasso nei portafogli dei due allevatori coinvolti. <br> 8. Il soggetto acquistato appare tra i soggetti in possesso dell'allevatore. |

---

# Casi d'uso: Chat real-time

## 1. Chattare con un altro allevatore

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore o Amministratore |
| **Descrizione** | L'utente può inviare e ricevere messaggi da altri utenti nella pagina "Messaggi". |
| **Precondizioni** | - L'utente ha effettuato il login. <br> - L'utente si trova nella pagina "Messaggi". |
| **Postcondizioni** | - L'utente ha inviato o ricevuto un messaggio. <br> - Se il messaggio è stato inviato, il destinatario vedrà una notifica di messaggio non letto. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'utente utilizza la barra di ricerca per trovare un altro utente con cui chattare. <br> 2. L'utente seleziona il destinatario dalla lista dei risultati. <br> 3. L'utente invia un messaggio al destinatario. <br> 4. Il destinatario riceve il messaggio e vede un badge di notifica con il numero di messaggi non letti. <br> 5. Il destinatario può aprire la chat per leggere i messaggi. |

## 2. Creare un Canale di chat di gruppo

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore o Amministratore |
| **Descrizione** | L'utente può creare un Canale di chat di gruppo aggiungendo uno o più utenti. |
| **Precondizioni** | - L'utente ha effettuato il login. <br> - L'utente si trova nella pagina "Messaggi". |
| **Postcondizioni** | - Un nuovo Canale di chat viene creato e i partecipanti sono aggiunti al gruppo. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'utente clicca sul pulsante "Crea Canale". <br> 2. Il sistema apre un modal per configurare il nuovo Canale. <br> 3. L'utente inserisce un nome per il Canale. <br> 4. L'utente seleziona uno o più utenti da aggiungere al Canale. <br> 5. L'utente conferma la creazione del Canale. <br> 6. Il sistema crea il Canale e aggiunge i partecipanti. <br> 7. Il nuovo Canale di chat è visibile nella lista dei Canali. |

---

# Casi d'uso: Configurare parametri

## 1. Scegliere le formule per il calcolo della valutazione dei soggetti

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore sceglie le formule da utilizzare durante il calcolo della valutazione dei propri soggetti. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Impostazioni". |
| **Postcondizioni** | - L'impostazione viene salvata. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore inserisce due formule nei rispettivi campi di testo. <br> 2. Il sistema effettua la validazione della formula e notifica l'allevatore eventuali errori. <br> 3. Il sistema aggiorna i due rispettivi grafici per rappresentare visivamente la formula. <br> 4. L'allevatore tramite uno slider decide quanto peso dare alle due formule. <br> 5 L'allevatore clicca sul pulsante "Salva". <br> 6. Il sistema salva le impostazioni e notifica l'utente in caso di eventuali errori. |

## 2. Scegliere il livello massimo di parentela calcolato dal sistema

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | L'allevatore può scegliere il livello massimo di parentela che viene calcolato dal sistema. |
| **Precondizioni** | - L'allevatore ha effettuato il login. <br> - L'allevatore si trova nella pagina "Impostazioni". |
| **Postcondizioni** | - L'impostazione viene salvata. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore seleziona il livello massimo desiderato tramite un apposito slider. <br> 2. L'allevatore clicca sul pulsante "Salva". <br> 3. Il sistema salva le impostazioni e notifica l'utente in caso di eventuali errori. |

---

# Casi d'uso: Richiesta di registrazione

## 1. Richiedere la registrazione

| **Sezione** | **Descrizione** |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | Un allevatore non registrato può richiedere la registrazione. |
| **Precondizioni** | - L'allevatore è registrato alla F.O.I.. <br> - L'allevatore non è registrato nel sistema. <br> - L'allevatore ha accesso a una casella di posta elettronica valida. |
| **Postcondizioni** | - Il sistema mostra un form per l'inserimento dei dati, tra cui l'e-mail. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore accede alla pagina di registrazione. <br> 2. Il sistema mostra il form per inserire i dati. <br> 3. L'allevatore inserisce l'indirizzo e-mail e gli altri dati necessari. <br> 4. Il sistema verifica i dati inseriti. <br> 5. Il sistema informa l'allevatore dell'avvenuta presa in carico della registrazione. |

## 2. Effettuare il login dopo la registrazione

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Allevatore |
| **Descrizione** | Una volta ricevuta l'e-mail di conferma contenente la password, l'allevatore può utilizzare l'e-mail e la password per effettuare il login nel sistema. |
| **Precondizioni** | - L'allevatore ha ricevuto una e-mail di conferma con una password di accesso. <br> - L'allevatore ha la password ricevuta nella e-mail. |
| **Postcondizioni** | - L'allevatore ha effettuato il login con successo. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'allevatore accede alla pagina di login. <br> 2. L'allevatore inserisce l'e-mail e la password ricevuta via e-mail. <br> 3. Il sistema verifica i dati. <br> 4. Il sistema consente all'allevatore di effettuare il login con successo. |

---

# Caso d'uso: L'amministratore approva o riufiuta richieste di registrazione

| **Sezione** | **Descrizione** |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Amministratore |
| **Descrizione** | L'amministratore può visualizzare una lista di tutte le richieste di registrazione per approvarle o rifiutarle. |
| **Precondizioni** | - L'amministratore ha effettuato il login con successo. <br> - L'amministratore si trova nella pagina "Registrazioni". <br> - Esistono richieste di registrazione in attesa di valutazione. |
| **Postcondizioni** | - Il sistema aggiorna lo stato della richiesta di registrazione (approvata o rifiutata). |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. Il sistema mostra la lista di tutte le richieste di registrazione. <br> 2. L'amministratore seleziona la richiesta di registrazione che vuole gestire. <br> 3. Il sistema mostra tutti i dati inseriti dall'allevatore e i documenti caricati per la richiesta selezionata. <br> 4. L'amministratore esamina i dettagli della richiesta. <br> 5. L'amministratore clicca su "Approva" o "Rifiuta" inserendo un'eventuale motivazione. <br> 6. Il sistema aggiorna lo stato della richiesta. <br> 7. Il sistema notifica l'utente tramite e-mail. <br> 8. Se la richiesta viene approvata il sistema invia nell'email di conferma la password di accesso. |

---

# Casi d'uso: L'amministratore gestisce le gare

## 1. Aggiungere una nuova gara

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Amministratore |
| **Descrizione** | L'amministratore può aggiungere una nuova gara nel sistema. |
| **Precondizioni** | - L'amministratore ha effettuato il login. <br> - L'amministratore si trova nella sezione "Gare". |
| **Postcondizioni** | - Una nuova gara viene creata e inserita nel sistema. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'amministratore clicca sul pulsante "Aggiungi". <br> 2. Il sistema apre un modulo per la creazione della gara. <br> 3. L'amministratore inserisce tutte le informazioni necessarie per la gara. <br> 4. L'amministratore conferma la creazione della gara. <br> 5. Il sistema salva la gara con lo stato selezionato. |

## 2. Modificare una gara esistente

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Amministratore |
| **Descrizione** | L'amministratore può modificare una gara già esistente nel sistema. |
| **Precondizioni** | - L'amministratore ha effettuato il login. <br> - L'amministratore si trova nella sezione "Gare". <br> - Esiste una gara da modificare. |
| **Postcondizioni** | - La gara viene aggiornata con le nuove informazioni. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'amministratore seleziona una gara esistente dalla lista. <br> 2. Il sistema apre il modulo di modifica della gara. <br> 3. L'amministratore modifica le informazioni necessarie. <br> 4. L'amministratore conferma le modifiche. <br> 5. Il sistema aggiorna i dati della gara. |

## 3. Cambiare lo stato di una gara

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attori coinvolti** | - Amministratore |
| **Descrizione** | L'amministratore può cambiare lo stato di una gara, passando da "Bozza" a "Pubblicata", "Da valutare" e infine "Completata". |
| **Precondizioni** | - L'amministratore ha effettuato il login. <br> - L'amministratore si trova nella sezione "Gare". <br> - Esiste una gara che necessita di modifica dello stato. |
| **Postcondizioni** | - Lo stato della gara è aggiornato correttamente in base all'azione scelta. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'amministratore seleziona una gara. <br> 2. L'amministratore sceglie lo stato della gara da una lista di opzioni (Bozza, Pubblicata, Da valutare, Completata). <br> 3. L'amministratore conferma la modifica dello stato. <br> 4. Il sistema aggiorna lo stato della gara. |

## 4. Eliminare una gara

| **Sezione** | **Descrizione** |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Amministratore |
| **Descrizione** | L'amministratore può eliminare una gara. |
| **Precondizioni** | - L'amministratore ha effettuato il login. <br> - L'amministratore si trova nella sezione "Gare". <br> - Esiste una gara da eliminare. |
| **Postcondizioni** | - La gara è impostata nello stato "Eliminata" e non è più visibile agli allevatori. |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'amministratore seleziona una gara da eliminare. <br> 2. L'amministratore clicca sul pulsante "Elimina". <br> 3. Il sistema imposta la gara nello stato "Eliminata" e la rimuove dalla visualizzazione pubblica. |

## 5. Stabilire la classifica di una gara

| **Sezione** | **Descrizione** |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Attori coinvolti** | - Amministratore |
| **Descrizione** | L'amministratore può stabilire la classifica di una gara inserendo i punteggi e modificando lo stato della gara. |
| **Precondizioni** | - L'amministratore ha effettuato il login. <br> - L'amministratore si trova nella sezione "Gare". <br> - La gara è in stato "Da valutare". |
| **Postcondizioni** | - I punteggi sono memorizzati e visibili nella gara. <br> - Lo stato della gara viene modificato in "Completata". |
| **Sequenza delle azioni** | **Scenario principale**: <br> 1. L'amministratore seleziona una gara con stato "Da valutare". <br> 2. Il sistema rende visibili i campi per l'inserimento dei punteggi. <br> 3. L'amministratore inserisce i punteggi dei partecipanti. <br> 4. L'amministratore clicca su "Salva" per memorizzare i punteggi. <br> 5. L'amministratore modifica lo stato della gara in "Completata" per rendere visibili i punteggi agli allevatori. |