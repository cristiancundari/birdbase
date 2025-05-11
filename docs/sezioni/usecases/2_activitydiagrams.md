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
        |Allevatore|
    endif
repeat while (Riprova?) is (sì) not (no)
stop
@enduml
```

## - Aggiungere, modificare o eliminare transazioni

```plantuml
@startuml
|Allevatore|
start
:Seleziona la transazione;
split
    :Clicca su "Aggiungi";
split again
    :Clicca su "Modifica";
end split

repeat
    split
        :Inserisci dettagli della transazione;
        :Clicca su "Salva";
        |Sistema|
        :Verifica dati;
        if (Dati validi?) then (sì)
            :Salva transazione;
            :Aggiorna la lista di transazioni;
            |Allevatore|
            :Visualizza la lista di transazioni aggiornata;
            stop
        else (no)
            :Mostra errore;
        endif
    split again
        :Clicca su "Annulla";
        label sp_lab0
        end
    end split
repeat while (Dati non validi)
@enduml
```

## - Eliminare transazioni

```plantuml
@startuml
|Allevatore|
start
:Seleziona la transazione;
    :Clicca su "Elimina";
    |Sistema|
    :Chiede conferma;
    |Allevatore|
    if (Conferma?) then (sì)
        |Sistema|
        :Elimina la transazione;
    else (no)
        |Allevatore|
        stop
    endif
|Sistema|
:Aggiorna la lista di transazioni;
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
|Allevatore|
repeat
    :Inserisce i dati richiesti;
    :Clicca su "Salva";
    |Sistema|
    if (Dati corretti?) then (Sì)
        :Salva il soggetto;
        |Allevatore|
        :Visualizza il soggetto nella lista;
        stop
    else (No)
        :Segnala i dati errati;
        |Allevatore|
    endif
repeat while (Riprova?) is (Sì) not (No)
stop
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
|Allevatore|
repeat
    :Modifica i dati;
    :Clicca su "Salva" per confermare le modifiche;
    |Sistema|
    if (Dati corretti?) then (Sì)
        :Salva le modifiche;
        |Allevatore|
        :Visualizza la lista dei soggetti aggiornata;
        stop
    else (No)
        :Segnala i dati errati;
        |Allevatore|
    endif
repeat while (Riprova?) is (Sì) not (No)
stop
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
if (Dati validi?) then (sì)
    :Salva la covata;
    |Allevatore|
    :Visualizza la covata nella lista;
else (no)
    :Mostra errore;
    |Allevatore|
    :Corregge i dati;
    :Click su "Salva";
    |Sistema|
    :Salva la covata;
    |Allevatore|
    :Visualizza la covata nella lista;
endif
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

repeat
    :Conferma l'azione;
    |Sistema|
    :Verifica dati;
    if (Dati validi?) then (sì)
        :Aggiunge il figlio alla covata;
        :Aggiorna la lista dei figli;
        |Allevatore|
        :Visualizza la lista dei figli aggiornata;
        stop
    else (no)
        :Mostra errore;
        |Allevatore|
    endif
repeat while (Dati non validi)
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
:Clicca su "Salva";
|Sistema|
    :Salva il promemoria;
    if (L'allevatore ha configurato la sincronizzazione con Google Calendar) then (Sì)
        if (Esiste il calendario "Birdbase" su Google Calendar) then (No)
            :Crea il calendario "Birdbase";
        else (Sì)
        endif
        :Aggiunge il promemoria sul calendario "Birdbase" di Google Calendar;
        if (Sincronizzazione riuscita?) then (sì)
            :Mostra conferma sincronizzazione;
        else (no)
            :Mostra errore sincronizzazione;
        endif
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
if (Autenticazione riuscita?) then (sì)
    :Associa l'account Google al sistema;
    :Mostra messaggio di avvenuta associazione;
    :Disabilita il bottone di connessione;
else (no)
    :Mostra errore di autenticazione;
    end
endif
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
:Mostra i dettagli della gara;
:Mostra i commenti relativi alla gara;
if (La gara è completata?) then (Si)
    :Mostra la classifica generale;
    if (I soggetti dell'allevatore sono in gara?) then (Si)
        :Mostra la classifica dei soggetti dell'allevatore;
    else (No)
    endif
else (No)
    :Mostra stato attuale della gara;
endif
|Allevatore|
:Visualizza le informazioni;
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
if (Il soggetto dell'allevatore è nella classifica?) then (Si)
    :Mostra la classifica dei soggetti dell'allevatore;
else (No)
endif
|Allevatore|
:Visualizza le informazioni;
stop
@enduml
```

## - Condividere sui social i soggetti classificati

```plantuml
@startuml
|Allevatore|
start
:Seleziona un soggetto dalla classifica della gara;
:Preme "Condividi";
|Sistema|
:Consente di scegliere il social;
|Allevatore|
:Sceglie il social su cui condividere;
|Sistema|
if (Connessione al social riuscita?) then (sì)
    :Condivide il Post;
    :Mostra conferma condivisione;
else (no)
    :Mostra errore di condivisione;
    end
endif
stop
@enduml
```

## - Selezionare i soggetti da iscrivere ed effettuare il pagamento con Paypal

```plantuml
@startuml
|Allevatore|
start
:Click sul pulsante "Iscrivi";
|Sistema|
:Mostra la lista di soggetti da registrare;
|Allevatore|
repeat
    :Seleziona un soggetto;
    |Sistema|
    :Aggiunge il soggetto al carrello;
    :Aggiorna l'elenco dei soggetti iscritti e il totale da pagare;
    |Allevatore|
repeat while (Deve registrare altri soggetti?) is (Sì) not (No)
:Clicca sul pulsante PayPal per procedere al pagamento;
|Sistema|
:Reindirizza l'allevatore alla pagina di PayPal;
|Allevatore|
:Effettua l'accesso al proprio account PayPal;
|Sistema|
if (Pagamento riuscito?) then (sì)
    :Completa l'iscrizione alla gara;
    :Mostra conferma del pagamento;
    stop
else (no)
    :Mostra errore di pagamento;
    end
endif
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
:Scrive una breve descrizione e assegna un prezzo;
:Conferma la creazione dell'annuncio;
|Sistema|
if (Dati validi?) then (sì)
    :Aggiunge l'annuncio alla lista degli annunci di vendita;
    :Mostra conferma creazione;
    stop
else (no)
    :Mostra errore di validazione;
    end
endif
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
:Conferma le modifiche;
|Sistema|
if (Dati validi?) then (sì)
    :Aggiorna l'annuncio con le nuove informazioni;
    :Mostra conferma aggiornamento;
    stop
else (no)
    :Mostra errore di validazione;
    end
endif
@enduml
```

## - Visualizzare un annuncio e acquistare un soggetto

```plantuml
@startuml
|Allevatore|
start
:Visualizza la lista degli annunci di vendita;
:Seleziona un annuncio;
|Sistema|
:Mostra i dettagli dell'annuncio;
|Allevatore|
:Clicca sul pulsante "PayPal";
|Sistema|
:Apre la finestra di PayPal;
|Allevatore|
:Finalizza il pagamento;
|Sistema|
if (Pagamento riuscito?) then (sì)
    :Rimuove l'annuncio acquistato dalla lista;
    :Crea voci di spese e incasso nei portafogli dei due allevatori;
    :Il soggetto acquistato appare in possesso dell'allevatore;
    :Mostra conferma di acquisto completato;
    stop
else (no)
    :Mostra errore di pagamento;
    end
endif
@enduml

```

## - Chattare con un altro allevatore

```plantuml
@startuml
|Allevatore|
start
:Utilizza la barra di ricerca per trovare un altro utente;
|Sistema|
:Cerca utenti corrispondenti;
if (Utenti trovati?) then (sì)
    :Mostra la lista dei risultati di ricerca;
    |Allevatore|
    :Seleziona il destinatario dalla lista;
    :Invia un messaggio al destinatario;
    |Sistema|
    :Invia il messaggio;
    |Destinatario|
    :Riceve il messaggio;
    :Vede notificato il numero di messaggi non letti;
    :Apri la chat per leggere il messaggio ricevuto;
    stop
else (no)
    |Sistema|
    :Mostra messaggio "Nessun utente trovato";
    end
endif
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
    :Invia il form;
    |Sistema|
    :Verifica i dati inseriti;
    if (Dati Validi?) then (Sì)
        :Salva la richiesta di registrazione;
        :Mostra la conferma della presa in carico della registrazione;
        stop
    else (No)
        :Mostra errori di validazione;
        |Allevatore|
    endif
repeat while (Riprova?) is (Sì) not (No)
end
@enduml

```

## - Effettuare il login dopo la registrazione

```plantuml
@startuml
|Allevatore|
start
:Clicca sulla pagina di login;
repeat
    :Inserire email e password;
    :Invia form di login;
    |Sistema|
    :Verifica i dati di login;
    if (Dati Corretti?) then (Sì)
        :Effettua il login con successo;
        :Reindirizza alla dashboard;
        stop
    else (No)
        :Mostra un messaggio di errore;
        |Allevatore|
    endif
repeat while (Riprova?) is (Sì) not (No)
end
@enduml


```

## - L'amministratore approva o riufiuta richieste di registrazione

```plantuml
@startuml
|Amministratore|
start
:Accede alla pagina "Registrazioni";
|Amministratore|
:Visualizza lista delle richieste di registrazione;
:Seleziona una richiesta;
|Sistema|
:Mostra richiesta selezionata;
|Amministratore|
:Esamina i dettagli della richiesta;
if (Decisione?) then (Rifiuta)
    |Amministratore|
    :Seleziona "Rifiuta";
    :Inserisce motivo del rifiuto;
    |Sistema|
    :Aggiorna stato della richiesta a "Rifiutata";
    :Invia notifica via e-mail con il motivo del rifiuto;
else (Approva)
    :Seleziona "Approva";
    |Sistema|
    :Aggiorna stato della richiesta a "Approvata";
    :Invia notifica via e-mail con la password di accesso;
endif
|Amministratore|
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
repeat
    :Inserisce informazioni gara;
    :Conferma creazione gara;
    |Sistema|
    :Verifica dati;
    if (Dati validi?) then (sì)
        :Salva la gara con lo stato selezionato;
        :Mostra conferma creazione;
        stop
    else (no)
        :Mostra errori di validazione;
        |Amministratore|
    endif
repeat while (Dati non validi)
@enduml

```

## - Cambiare lo stato di una gara

```plantuml
@startuml
|Amministratore|
start
:Seleziona una gara;
|Sistema|
:Mostra i dettagli della gara;
|Amministratore|
repeat
    :Modifica lo stato;
    :Salva modifica stato;
    |Sistema|
    if (Modifica valida?) then (no)
        :Mostra errore di validazione;
    else (sì)
        :Aggiorna stato della gara;
        :Mostra conferma aggiornamento;
        stop
    endif
repeat while (Dati non validi)

@enduml

```

## - Stabilire la classifica di una gara

```plantuml
@startuml
|Amministratore|
start
:Seleziona una gara con stato "Da valutare";
|Sistema|
:Verifica lo stato della gara;
if (Stato corretto?) then (sì)
    :Rende visibili i campi per i punteggi;
    |Amministratore|
    repeat
        :Inserisce i punteggi dei partecipanti;
        :Clicca su "Salva" per memorizzare i punteggi;
        |Sistema|
        if (Punteggi validi?) then (sì)
            :Salva punteggi;
            :Modifica stato gara in "Completata";
            :Genera la classifica definitiva;
        else (no)
            :Mostra errori nei punteggi;
        endif
    repeat while (Punteggi validi) is (no) not (si)
else (no)
    :Mostra errore stato non valido;
    end
endif
stop
@enduml
```

## - Scegliere le formule per il calcolo della valutazione dei soggetti

```plantuml
@startuml
|Allevatore|
start
:Accede alla sezione impostazioni;
repeat
:Inserisce la formula;
|Sistema|
:Verifica la correttezza della formula;
if (Formula valida?) then (Sì)
    :Mostra graficamente la formula;
    |Allevatore|
    :Clicca su "Salva";
    |Sistema|
    :Salva le formule inserite;
    :Mostra conferma salvataggio;
    stop
else (No)
    :Mostra il messaggio di errore;
endif
repeat while (Formula valida?) is (No) not (Sì)
@enduml

```
