## - Login

```plantuml
@startuml
|Allevatore|
start
:Visualizza la pagina di login;
repeat
    :Inserisce e-mail;
    :Inserisce password;
    :Premi "Accedi";

    |Sistema|
    :Verifica credenziali;
    if (Credenziali corrette?) then (sì)
    :Verifica ruolo;
    :Reindirizza alla dashboard;
    stop
    else (no)
    :Mostra messaggio di errore;
    endif
repeatwhile()
@enduml
```

## - Aggiungere, modificare o eliminare transazioni

```plantuml
@startuml
    |Allevatore|
    start
    :Seleziona la transazione;
    split
        split
            :Clicca su "Aggiungi";
        split again
            :Clicca su "Modifica";
        end split
        :Inserisci dettagli della transazione;
        :Clicca su "Salva";
        |Sistema|
        :Salva transazione;
    split again
    |Allevatore|
        :Clicca su "Elimina";
        |Sistema|
        :Chiede conferma;
        |Allevatore|
        :Clicca su "Conferma";
        |Sistema|
        :Elimina la transazione;
    end split

    |Allevatore|
    :Visualizza la lista di transazioni aggiornata;

    stop
@enduml
```

## - Generare report di un arco temporale

```plantuml
@startuml
    |Allevatore|
    start

    :Selezionare "Genera report";
    :Scegliere tipo di report;
    split
        :Scegliere intervallo di date personalizzato;
    split again
        :Scegliere intervallo di date predefinito;
    end split

    :Confermare selezione;
    |Sistema|
    :Elabora il report;
    |Allevatore|
    :Visualizzare il report generato;

    stop
@enduml
```

## - Aggiungere un soggetto

```plantuml
@startuml
    |Allevatore|
    start
    :Clicca su "Aggiungi";
    |Sistema|
    :Apre il modulo per inserire i dati;
    repeat
    |Allevatore|
    :Inserisce i dati richiesti;
    :Clicca su "Salva";

    |Sistema|
    if (Dati corretti?) then (Sì)
        :Salva il soggetto;
        |Allevatore|
        :Visualizza il soggetto nella lista;
        stop
    else (No)
        |Sistema|
        :Segnala i dati errati;
@enduml
```

## - Modificare un soggetto

```plantuml
@startuml
    |Allevatore|
    start

    :Selezionare il soggetto da modificare;
    :Clicca su "Modifica";

    |Sistema|
    :Apre il modulo con i dati esistenti;
    repeat
    |Allevatore|
    :Modifica i dati;
    :Clicca su "Salva" per confermare le modifiche;
    |Sistema|
    if (Dati corretti?) then (Sì)
        :Salva le modifiche;
    
        |Allevatore|
        :Visualizza la lista dei soggetti aggiornata;
        stop
    else (No)
        |Sistema|
        :Segnala i dati errati;
@enduml
```

## - Selezionare un soggetto come preferito

```plantuml
@startuml
    |Allevatore|
    start
    :Selezionare il soggetto;
    :Clicca sull'icona a forma di cuore;
    |Sistema|
    if (È preferito) then (Sì)
        :Disattiva lo stato di preferito;
    else (No)
        :Attiva lo stato di preferito;
    endif

    :L'icona viene aggiornata per riflettere lo stato;

    |Allevatore|
    :Visualizza l'icona corretta;

    stop
@enduml
```

## - Aggiungere una covata

```plantuml
@startuml
|Allevatore|
start
:Click su "Aggiungi";
:Seleziona padre (o madre) dalla lista;
|Sistema|
:Calcolo automatico delle parentele;
|Allevatore|
:Inserisce gli altri dati;
:Click su "Salva";
|Sistema|
:Salva la covata;
|Allevatore|
:Visualizza la covata nella lista;
stop
@enduml
```

## - Aggiungere figli a una covata

```plantuml
@startuml
|Allevatore|
start
:Seleziona covata dalla lista;
:Clicca su "Visualizza dettagli";
:Visualizza informazioni della covata;
:Clicca su "Aggiungi figli";
split
    :Seleziona un soggetto esistente;
split again
    #LightBlue:Crea un soggetto ex-novo;
end split

:Conferma l'azione;
|Sistema|
:Aggiunge il figlio alla covata;
|Allevatore|
:Visualizza la lista dei figli aggiornata;
stop
@enduml
```

## - Creare un promemoria

```plantuml
@startuml
|Allevatore|
start
:Clicca su "Nuovo promemoria";
:Seleziona data e ora per il promemoria;
:Inserisce titolo e priorità;

|Allevatore|
:Clicca su "Salva";

|Sistema|
:Salva il promemoria;
if (L'allevatore ha configurato la sincronizzazione con Google Calendar) then (Sì)
    if (Esiste il calendario "Birdbase" su Google Calendar) then (No)
        :Crea il calendario "Birdbase";
    else (Sì)
    endif
    :Aggiunge il promemoria sul calendario "Birdbase" di Google Calendar;
else (No)
endif
|Allevatore|
:Visualizza il calendario aggiornato;

stop
@enduml
```
## - Configurare connessione con Google Calendar

```plantuml
@startuml
|Allevatore|
start
:Click su "Link Google Calendar";

|Sistema|
:Apri la finestra di login Google;

|Allevatore|
:Inserisce le credenziali Google;
:Autenticazione tramite Google;

|Sistema|
:Associa l'account Google al sistema;
:Mostra messaggio di avvenuta associazione;
:Disabilita il bottone di connessione;

stop
@enduml
```

## - Visualizzare i dettagli di una gara

```plantuml
@startuml
|Allevatore|
start
:Seleziona una gara dalla lista;

|Sistema|
:Mostra i commenti relativi alla gara;
if (La gara è completata?) then (Si)
  :Mostra la classifica generale;
  :Mostra la classifica dei soggetti dell'allevatore;
else (No)
endif

stop
@enduml


```

## - Visualizzare la classifica di una gara completata

```plantuml
@startuml
|Allevatore|
start
:Seleziona una gara completata dalla lista;

|Sistema|
:Mostra la classifica generale;
if(Il soggetto dell'allevatore è nella classifica?) then (Si)
  :Mostra la classifica dei soggetti dell'allevatore;
else (No)
endif

stop
@enduml
```

## - Condividere sui social i soggetti classificati

```plantuml
@startuml
|Allevatore|
start
:Seleziona un soggetto dalla classifica della gara;

|Allevatore|
:Preme "Condividi";

|Sistema|
:Consente di scegliere il social;

|Allevatore|
:Sceglie il social su cui condividere;

|Sistema|
:Condivide il Post;

stop
@enduml
```

## - Selezionare i soggetti da iscrivere ed effettuare il pagamento con Paypal

```plantuml
@startuml
|Allevatore|
start
repeat
:Click sul pulsante "Iscrivi";

|Sistema|
:Mostra la lista di soggetti da registrare;

|Allevatore|
:Seleziona un soggetto;

|Sistema|
:Aggiunge il soggetto al carrello;

|Sistema|
:Aggiorna l'elenco dei soggetti iscritti e il totale da pagare;


|Allevatore|
repeat while (Deve registrare altri soggetti?) is (Sì) not (No)

|Allevatore|
:Clicca sul pulsante PayPal per procedere al pagamento;

|Sistema|
:Reindirizza l'allevatore alla pagina di PayPal;

|Allevatore|
:Effettua l'accesso al proprio account PayPal;

|Sistema|
:Conferma il pagamento e completa l'iscrizione alla gara;

stop
@enduml
```


## - Creare un annuncio di vendita

```plantuml
@startuml
|Allevatore|
start
:Click sul pulsante "Aggiungi";

|Sistema|
:Mostra il modal per creare un nuovo annuncio;

|Allevatore|
:Seleziona il soggetto da mettere in vendita;

|Allevatore|
:Scrive una breve descrizione e assegna un prezzo;

|Allevatore|
:Conferma la creazione dell'annuncio;

|Sistema|
:Aggiunge l'annuncio alla lista degli annunci di vendita;

stop
@enduml

```

## - Modificare un annuncio di vendita

```plantuml
@startuml
|Allevatore|
start
:Seleziona un annuncio esistente;

|Sistema|
:Apre il modal per modificare l'annuncio;

|Allevatore|
:Modifica le informazioni del soggetto, descrizione o prezzo;

|Allevatore|
:Conferma le modifiche;

|Sistema|
:Aggiorna l'annuncio con le nuove informazioni;

stop
@enduml


```

## - Visualizzare un annuncio e acquistare un soggetto

```plantuml
@startuml
|Allevatore|
start
:Visualizza la lista degli annunci di vendita;

|Sistema|
:Mostra i dettagli dell'annuncio;

|Allevatore|
:Clicca sul pulsante "PayPal";

|Sistema|
:Apre la finestra di PayPal;

|Allevatore|
:Finalizza il pagamento;

|Sistema|
:Rimuove l'annuncio acquistato dalla lista;

|Sistema|
:Crea voci di spese e incasso nei portafogli dei due allevatori;

|Sistema|
:Il soggetto acquistato appare in possesso dell'allevatore;

stop
@enduml

```

## - Chattare con un altro allevatore
```plantuml
@startuml
|Allevatore|
start
:Utilizza la barra di ricerca per trovare un altro utente;

|Sistema|
:Mostra la lista dei risultati di ricerca;

|Allevatore|
:Seleziona il destinatario dalla lista;

|Allevatore|
:Invia un messaggio al destinatario;

|Sistema|
:Notifica il destinatario con il numero di messaggi non letti;

|Destinatario|
:Apri la chat per leggere il messaggio ricevuto;

stop
@enduml


```

## - Creare un Canale di chat di gruppo
```plantuml
@startuml
|Allevatore|
start
:Clicca sul pulsante "Crea Canale";

|Sistema|
:Apre un modal per configurare il nuovo Canale;

|Allevatore|
:Inserisce un nome per il Canale;

|Allevatore|
:Seleziona uno o più utenti da aggiungere al Canale;

|Allevatore|
:Conferma la creazione del Canale;

|Sistema|
:Crea il Canale e aggiunge i partecipanti;

|Allevatore|
:Visualizza il nuovo Canale nella lista dei Canali;

stop
@enduml
```

## - Richiedere la registrazione
```plantuml
@startuml
|Allevatore|
start
:Clicca su Registrati;

|Sistema|
:Mostra il form di registrazione;
|Allevatore|
repeat
:Inserisce i dati;

|Sistema|
:Verifica i dati inseriti;

|Sistema|
if(Dati Validi?) then (Sì)
    :Mostra la conferma della presa in carico della registrazione;
    stop
else (No)
    :Mostra un messaggio di errore;    
endif
repeatwhile()
@enduml

```

## - Effettuare il login dopo la registrazione
```plantuml
@startuml
|Allevatore|
start
:Clicca sulla pagina di login;
repeat
|Allevatore|
:Inserire email e password;

|Sistema|
:Verifica i dati di login;

|Sistema|
:Verifica che i dati siano corretti;

|Sistema|
if(Dati Corretti?) then (Sì)
    :Effettua il login con successo;
    stop
else (No)
    :Mostra un messaggio di errore;
endif
repeatwhile()  
@enduml


```

## - L'amministratore approva o riufiuta richieste di registrazione
```plantuml
@startuml
|Amministratore|
start
:Accede alla pagina "Registrazioni";
:Visualizza lista delle richieste di registrazione;
:Seleziona una richiesta;

|Sistema|
:Mostra richiesta selezionata;

|Amministratore|
:Esamina i dettagli della richiesta;
:Seleziona "Approva" o "Rifiuta";

|Sistema|
if (Approvata?) then (Sì)
  :Aggiorna stato della richiesta a "Approvata";
  :Invia notifica via e-mail con la password di accesso;
else (No)
  :Aggiorna stato della richiesta a "Rifiutata";
  :Invia notifica via e-mail con il motivo del rifiuto;
endif

|Sistema|
stop
@enduml

```

## - Aggiungere una nuova gara
```plantuml
@startuml

|Amministratore|
start
:Click su "Aggiungi";

|Sistema|
:Mostra modulo di creazione gara;

|Amministratore|
:Inserisce informazioni gara;
:Conferma creazione gara;

|Sistema|
:Salva la gara con lo stato selezionato;
stop
@enduml

```

## - Cambiare lo stato di una gara
```plantuml
@startuml

|Amministratore|
start
:Seleziona una gara;

|Amministratore|
:Modifica lo stato;
:Salva modifica stato;

|Sistema|
:Aggiorna stato della gara;
stop
@enduml

```

## - Stabilire la classifica di una gara
```plantuml
@startuml

|Amministratore|
start
:Seleziona una gara con stato "Da valutare";

|Sistema|
:Rende visibili i campi per i punteggi;

|Amministratore|
:Inserisce i punteggi dei partecipanti;
:Clicca su "Salva" per memorizzare i punteggi;
:Modifica stato gara in "Completata";

|Sistema|
:Salva punteggi e aggiorna stato della gara;
stop
@enduml

```

## - Scegliere le formule per il calcolo della valutazione dei soggetti
```plantuml
@startuml

|Allevatore|
start
:Inserisce le formule;

|Sistema|
:Verifica la correttezza delle formule;
if (Valida?) then (Sì)
  :Mostra graficamente le formule;
else (No)
  :Mostra il messaggio di errore;
endif

|Allevatore|
:Clicca su "Salva";

|Sistema|
:Salva le formule inserite;
stop
@enduml

```