Durante la fase di testing nell'ambito dello sviluppo della nostra web-app utilizzando la metodologia agile con un approccio di pair-programming, ci siamo concentrati sull'assicurarci che ogni componente e funzionalità del sistema fossero robusti e conformi alle specifiche richieste.
L'approccio iterativo e incrementale della metodologia agile ci ha permesso di verificare il codice attraverso test automatizzati per garantire la coerenza nel tempo e per facilitare la verifica continua delle nuove funzionalità integrate.

Per la creazioni dei suddetti test automatizzati abbiamo utilizzato le seguenti librerie:

- **Vitest** - framework che facilita e organizza il processo di testing del software, aiutando gli sviluppatori a scrivere, eseguire e analizzare i test in modo efficiente
- **React Testing Library** - libreria utile a testare qualsiasi tipo di componente React
- **Jest-Dom** - lavora in tandem con _React Testing Library_, ed è utilizzato per simulare la DOM di un browser per renderizzare i componenti da testare
- **Mock Service Worker** - libreria di simulazione API che consente di scrivere mocks indipendenti dal client e riutilizzarle su qualsiasi framework

### Test effettuati:

I seguenti test sono stati suddivisi per componente e/o funzionalità:

1. Componente Marketplace
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente il componente con le inserzioni
     <span style="color:green">✓</span> dovrebbe mostrare un messaggio quando non ci sono inserzioni
     <span style="color:green">✓</span> dovrebbe aprire il modal per aggiungere una nuova inserzione
     <span style="color:green">✓</span> dovrebbe aggiungere una nuova inserzione e mostrare una notifica
     <span style="color:green">✓</span> dovrebbe modificare un'inserzione e mostrare una notifica
     <span style="color:green">✓</span> dovrebbe eliminare un'inserzione e mostrare una notifica

1. \<Transazioni />
     <span style="color:green">✓</span> dovrebbe visualizzare la lista delle transazioni
     <span style="color:green">✓</span> dovrebbe visualizzare il modal di aggiunta transazione quando si fa click sul pulsante aggiungi
     <span style="color:green">✓</span> dovrebbe salvare una nuova transazione
     <span style="color:green">✓</span> dovrebbe visualizzare il modal di modifica con i relativi dati già inseriti ed effettuare il salvataggio
     <span style="color:green">✓</span> dovrebbe visualizzare il modal di cancellazione se cliccato il pulsante elimina ed eliminare la transazione

1. Covate CRUD
     <span style="color:green">✓</span> dovrebbe ottenere tutte le covate
     <span style="color:green">✓</span> dovrebbe aprire il modal cliccando il bottone aggiungi e salvare la covata cliccando il bottone salva
     <span style="color:green">✓</span> dovrebbe aprire il modal in modalità di modifica se cliccato il bottone MODIFICA ed effettuare il salvataggio se cliccato su salva
     <span style="color:green">✓</span> dovrebbe eliminare la covata se cliccato il pulsante elimina
     
1. \<CovataComp/>
     <span style="color:green">✓</span> dovrebbe visualizzare la gabbia se è presente
     <span style="color:green">✓</span> dovrebbe nascondere la gabbia se non è presente
     <span style="color:green">✓</span> dovrebbe visualizzare l'icona covata completata se settata
     <span style="color:green">✓</span> dovrebbe nascondere l'icona covata completata se settata

1. \<SoggettoComp />
     <span style="color:green">✓</span> dovrebbe visualizzare l'icona del sesso maschio
     <span style="color:green">✓</span> dovrebbe visualizzare l'icona del sesso femmina
     <span style="color:green">✓</span> dovrebbe visualizzare l'icona del sesso in attesa
     <span style="color:green">✓</span> dovrebbe mostrare l'icona morto se il soggetto è morto e nascondere l'icona della gabbia (se valorizzata)
     <span style="color:green">✓</span> dovrebbe mostrare l'icona della gabbia (se valorizzata) se è vivo
     <span style="color:green">✓</span> dovrebbe nascondere l'icona della gabbia (se non valorizzata) se è vivo
     <span style="color:green">✓</span> dovrebbe mostrare l'icona della nota se valorizzata
     <span style="color:green">✓</span> dovrebbe mostrare la nota se valorizzata quando si passa col mouse sull'icona
     <span style="color:green">✓</span> dovrebbe nascondere l'icona della nota se stringa vuota
     <span style="color:green">✓</span> dovrebbe mostrare l'icona attiva del preferito se il soggetto è impostato come preferito
     <span style="color:green">✓</span> dovrebbe mostrare l'icona non attiva del preferito se il soggetto non è impostato come preferito
     <span style="color:green">✓</span> dovrebbe mostrare l'identificativo dell'anelletto come RNA-Anno-Numero
     <span style="color:green">✓</span> dovrebbe mostrare l'immagine del soggetto se ne esiste una
     <span style="color:green">✓</span> dovrebbe mostrare un placeholder come immagine del soggetto se non ne esiste una
     
1. Soggetto CRUD
     <span style="color:green">✓</span> dovrebbe renderizzare la home page mostrando tutti i soggetti
     <span style="color:green">✓</span> dovrebbe mostrare il componente 'nessun soggetto' se l'API non restituisce nessun elemento
     <span style="color:green">✓</span> dovrebbe aprire il modal quando viene premuto il pulsante aggiungi
     <span style="color:green">✓</span> dovrebbe effettuare un inserimeto se cliccato il pulsante salva
     <span style="color:green">✓</span> dovrebbe effettuare la cancellazione del soggetto se cliccato il pulsante elimina del modal
     <span style="color:green">✓</span> dovrebbe mostrare il modal in modalità di modifica e modificare il soggetto
     <span style="color:green">✓</span> dovrebbe impostare il soggetto come preferito se si clicca la relativa icona

1. Pagina Login
     <span style="color:green">✓</span> deve fare il redirect all'URL di callback o alla home se l'utente è già loggato
     <span style="color:green">✓</span> deve fare il redirect alla /app/home se non viene fornito un URL di callback e l'utente è loggato
     <span style="color:green">✓</span> deve renderizzare il componente Login se l'utente non è loggato
     
1. Componente Login
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente il componente
     <span style="color:green">✓</span> dovrebbe visualizzare un messaggio di errore in caso di login fallito
     <span style="color:green">✓</span> dovrebbe reindirizzare alla home dell'utente in caso di login riuscito
     <span style="color:green">✓</span> dovrebbe reindirizzare alla home dell'amministratore in caso di login riuscito per amministratori

1. PromemoriaPage
     <span style="color:green">✓</span> dovrebbe visualizzare il pulsante "Aggiungi"
     <span style="color:green">✓</span> dovrebbe aprire il modal quando si clicca su "Aggiungi"
     <span style="color:green">✓</span> dovrebbe visualizzare correttamente i promemoria per il giorno selezionato
     <span style="color:green">✓</span> dovrebbe aprire il modal di cancellazione quando si clicca su "Elimina"
     <span style="color:green">✓</span> dovrebbe cancellare il promemoria quando si conferma l'eliminazione
     <span style="color:green">✓</span> dovrebbe aggiungere un nuovo promemoria quando si invia il form

1. RegistrazioneAdminModal
     <span style="color:green">✓</span> dovrebbe renderizzare il modal con i documenti
     <span style="color:green">✓</span> dovrebbe mostrare il campo di descrizione e i pulsanti di approvazione e rifiuto
     <span style="color:green">✓</span> dovrebbe approvare una richiesta e mostrare una notifica
     <span style="color:green">✓</span> dovrebbe rifiutare una richiesta e mostrare una notifica
     <span style="color:green">✓</span> dovrebbe mostrare una notifica di errore in caso di approvazione fallita
     <span style="color:green">✓</span> dovrebbe mostrare una notifica di errore in caso di rifiuto fallito

1. InserzioneItem
     <span style="color:green">✓</span> renderizza correttamente l'inserzione
     <span style="color:green">✓</span> chiama onEdit quando si clicca su Modifica
     <span style="color:green">✓</span> chiama onDelete quando si clicca su Elimina
     <span style="color:green">✓</span> cattura l'ordine correttamente
     <span style="color:green">✓</span> mostra un messaggio di errore se la cattura dell'ordine fallisce

1. Carrello
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente il carrello vuoto
     <span style="color:green">✓</span> dovrebbe aggiungere un soggetto al carrello
     <span style="color:green">✓</span> dovrebbe rimuovere un soggetto dal carrello
     <span style="color:green">✓</span> dovrebbe creare un ordine PayPal

1. Pagina Register
     <span style="color:green">✓</span> dovrebbe renderizzare la pagina
     
1. Componente Register
     <span style="color:green">✓</span> dovrebbe mostrare i campi del modulo
     <span style="color:green">✓</span> dovrebbe visualizzare messaggi di errore per input non validi

1. InfoGara
     <span style="color:green">✓</span> visualizza il breadcrumb corretto per l'utente admin
     <span style="color:green">✓</span> visualizza il messaggio corretto quando la gara è completata
     <span style="color:green">✓</span> visualizza il messaggio corretto quando la gara è in attesa di valutazione
     <span style="color:green">✓</span> visualizza il messaggio corretto quando non ci sono più posti disponibili
     <span style="color:green">✓</span> visualizza la sezione Iscrizioni quando la gara è aperta
     <span style="color:green">✓</span> visualizza il Carrello solo per gli utenti non admin
     <span style="color:green">✓</span> visualizza la sezione Incassi per gli utenti admin

1. ModalChangePassword
     <span style="color:green">✓</span> dovrebbe aprire il modal e resettare il form
     <span style="color:green">✓</span> dovrebbe chiudere il modal quando si clicca su Annulla
     <span style="color:green">✓</span> dovrebbe mostrare notifiche in caso di errore
     <span style="color:green">✓</span> dovrebbe mostrare una notifica di successo quando la password è cambiata
     <span style="color:green">✓</span> dovrebbe mostrare errori di validazione quando il form è inviato con input vuoti
     <span style="color:green">✓</span> dovrebbe mostrare errori di validazione per password non corrispondenti

1. Grafico Piechart
     <span style="color:green">✓</span> dovrebbe ottenere i dati delle spese e mostrarli nel grafico
     <span style="color:green">✓</span> dovrebbe mostrare la pagina vuota quando non ci sono spese
     <span style="color:green">✓</span> dovrebbe mostrare la notifica di errore se l'API fallisce
     
1. Grafico Barchart
     <span style="color:green">✓</span> dovrebbe ottenere i dati degli incassi e mostrarli nel grafico
     <span style="color:green">✓</span> dovrebbe mostrare la pagina vuota quando non ci sono incassi
     <span style="color:green">✓</span> dovrebbe mostrare la notifica di errore se l'API fallisce

1. \<Budget />
     <span style="color:green">✓</span> dovrebbe visualizzare il budget dell'utente
     <span style="color:green">✓</span> dovrebbe visualizzare il bilancio (budget - spese del mese in corso)
     <span style="color:green">✓</span> dovrebbe visualizzare un input per modificare il budget quando si attiva la modalità di modifica
     <span style="color:green">✓</span> dovrebbe salvare una modifica al budget

1. InfoSoggetto
     <span style="color:green">✓</span> renderizza correttamente le informazioni del soggetto
     <span style="color:green">✓</span> visualizza correttamente la lista dei parenti
     <span style="color:green">✓</span> mostra un messaggio se non ci sono parenti
     <span style="color:green">✓</span> visualizza un caricamento durante il fetch delle parentele
 
 1. Tokenizer
     <span style="color:green">✓</span> dovrebbe rilevare un numero
     <span style="color:green">✓</span> dovrebbe rilevare un addizione di due numeri
     <span style="color:green">✓</span> dovrebbe gestire i numeri float con il .
     <span style="color:green">✓</span> dovrebbe generare un errore se ci sono più punti decimali
     <span style="color:green">✓</span> dovrebbe generare un errore se il punto decimale è posizionato all'inizio o alla fine
     <span style="color:green">✓</span> dovrebbe rilevare correttamente le parentesi
     <span style="color:green">✓</span> dovrebbe rilevare correttamente le funzioni
     <span style="color:green">✓</span> dovrebbe ignorare gli spazi
     <span style="color:green">✓</span> dovrebbe rilevare una x come variabile
     <span style="color:green">✓</span> dovrebbe risolvere la funzione 11.3+8.7/2*sin(2^x)/ln(5)

1. InfoCovata
     <span style="color:green">✓</span> renderizza il componente con i dati iniziali
     <span style="color:green">✓</span> apre il modulo per aggiungere un nuovo soggetto
     <span style="color:green">✓</span> invia il modulo per aggiungere un soggetto
     <span style="color:green">✓</span> rimuove un soggetto quando confermato

1. Componente ModalGara
     <span style="color:green">✓</span> si rende correttamente quando aperto
     <span style="color:green">✓</span> valida correttamente i campi del modulo
     <span style="color:green">✓</span> invia il modulo con i valori corretti
     <span style="color:green">✓</span> chiama annulla quando il modulo viene chiuso
     <span style="color:green">✓</span> carica le nazioni e le visualizza nel campo di selezione

1. Componente FunzioneValutazione
     <span style="color:green">✓</span> Dovrebbe renderizzare il componente
     <span style="color:green">✓</span> Dovrebbe effettuare il salvataggio del dato
     <span style="color:green">✓</span> Dovrebbe ricalcolare le formule ogni volta che gli input vengono modificati
     <span style="color:green">✓</span> Dovrebbe rilevare errori nella formula

1. Pagina InfoSoggettoPage
     <span style="color:green">✓</span> dovrebbe mostrare il messaggio di errore quando il soggetto non viene trovato
     <span style="color:green">✓</span> dovrebbe mostrare le informazioni del soggetto
     <span style="color:green">✓</span> dovrebbe renderizzare l'avatar se presente

1. IscrizioneItem
     <span style="color:green">✓</span> dovrebbe mostrare i dettagli del soggetto e dell'allevatore
     <span style="color:green">✓</span> dovrebbe mostrare il voto e la posizione se la gara è completata
     <span style="color:green">✓</span> dovrebbe nascondere il voto e la posizione se la gara non è completata
     <span style="color:green">✓</span> dovrebbe mostrare "N.C." se la posizione è null
     <span style="color:green">✓</span> dovrebbe mostrare, se l'utente è admin e la gara è in valutazione, un campo in cui inserire il voto
     <span style="color:green">✓</span> dovrebbe chiamare onVotoChange quando il voto viene cambiato

1. GaraCard
     <span style="color:green">✓</span> dovrebbe visualizzare il titolo della gara
     <span style="color:green">✓</span> dovrebbe visualizzare la tipologia della gara
     <span style="color:green">✓</span> dovrebbe mostrare i badge corretti
     <span style="color:green">✓</span> dovrebbe mostrare il menu per l'admin
     <span style="color:green">✓</span> dovrebbe chiamare onEdit quando viene selezionata l'opzione Modifica
     <span style="color:green">✓</span> dovrebbe chiamare onDelete quando viene selezionata l'opzione Elimina

1. PromemoriaComp
     <span style="color:green">✓</span> renderizza il titolo e la descrizione del promemoria
     <span style="color:green">✓</span> renderizza l'ora corretta
     <span style="color:green">✓</span> visualizza l'icona corretta in base allo stato di completamento
     <span style="color:green">✓</span> chiama modalModifica quando si clicca sul pulsante Modifica
     <span style="color:green">✓</span> chiama modalElimina quando si clicca sul pulsante Elimina
     <span style="color:green">✓</span> visualizza il pulsante del menu

1. ModalPromemoria
     <span style="color:green">✓</span> viene visualizzato correttamente quando è aperto
     <span style="color:green">✓</span> valida i campi obbligatori
     <span style="color:green">✓</span> chiama submit con i valori corretti
     <span style="color:green">✓</span> chiama annulla quando viene annullato

1. Pagina Report Portafoglio
     <span style="color:green">✓</span> dovrebbe mostrare lo stato di caricamento
     <span style="color:green">✓</span> dovrebbe mostrare la tabella del report con i relativi dati
     <span style="color:green">✓</span> dovrebbe chiamare router.back cliccando sul pulsante indietro
     <span style="color:green">✓</span> dovrebbe chiamare handlePrint cliccando sul pulsante stampa

1. Classifica
     <span style="color:green">✓</span> visualizza la classifica totale
     <span style="color:green">✓</span> visualizza la classifica personale per l'utente
     <span style="color:green">✓</span> non visualizza la classifica personale per l'amministratore

1. Navbar
     <span style="color:green">✓</span> Mostra la Navbar con i link e le informazioni dell'utente
     <span style="color:green">✓</span> chiama la funzione di logout e reindirizza l'utente quando si clicca sull'elemento di logout

1. RegistrazioniAdminPage
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente la pagina con dati di registrazione
     <span style="color:green">✓</span> dovrebbe gestire correttamente lo stato di caricamento
     <span style="color:green">✓</span> dovrebbe aprire il modal quando si clicca sul bottone 'Esamina'

1. PortafoglioPage
     <span style="color:green">✓</span> renderizza correttamente la pagina
     <span style="color:green">✓</span> apre il modal report quando si clicca sul pulsante 'Genera Report'
     <span style="color:green">✓</span> chiude il modal report quando si preme il tasto annulla
     <span style="color:green">✓</span> invoca il router push con i dati corretti quando si invia il report

1. Pagina che visualizza il risultato di un soggetto ad una gara.
     <span style="color:green">✓</span> Se non è presente la gara o il soggetto verra fatto il redirect alla home page.
     <span style="color:green">✓</span> Dovrebbe renderizzare i dati del risultato della gara

1. ModalSelezionaSoggetto
     <span style="color:green">✓</span> dovrebbe renderizzare il modal e consentire di selezionare un soggetto
     <span style="color:green">✓</span> dovrebbe mostrare un messaggio di errore se non viene selezionato alcun soggetto
     <span style="color:green">✓</span> dovrebbe chiamare la funzione 'annulla' quando il modal viene chiuso

1. InfoGaraHeader
     <span style="color:green">✓</span> renderizza titolo e icona
     <span style="color:green">✓</span> visualizza la data e il tipo corretti
     <span style="color:green">✓</span> mostra i posti disponibili
     <span style="color:green">✓</span> visualizza città e nazione

1. Pagina dettagli gara ADMIN
     <span style="color:green">✓</span> Dovrebbe renderizzare la pagina con le informazioni sulla gara
     <span style="color:green">✓</span> Dovrebbe mostrare il componente GaraNonValida se la gara non viene trovata
     <span style="color:green">✓</span> Dovrebbe mostrare il componente GaraNonValida se l'utente non è un ADMIN

1. AllevatoriAdminPage
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente la pagina con i dati degli allevatori
     <span style="color:green">✓</span> gestisce correttamente gli errori nella chiamata API

1. InfoCovataHeader
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente le informazioni della covata
     <span style="color:green">✓</span> dovrebbe mostrare il componente Completata se completata è true

1. NessunaGara
     <span style="color:green">✓</span> visualizza il messaggio di default
     <span style="color:green">✓</span> visualizza il messaggio per l'admin quando l'utente è admin
     <span style="color:green">✓</span> non visualizza il messaggio per l'admin per utenti non-admin

1. PayPalButton
     <span style="color:green">✓</span> disabilita il bottone se 'disabled' è true
 
 1. Parser
     <span style="color:green">✓</span> converte una formula dal formato infix a postfix
     <span style="color:green">✓</span> calcola l'ordine corretto dell'esponenziale
     <span style="color:green">✓</span> dovrebbe calcolare prima il risultato dell'espressione tra parentesi
     <span style="color:green">✓</span> dovrebbe dare un errore se le parentesi non sono bilanciate
     <span style="color:green">✓</span> dovrebbe dare un errore se l'espressione contiene caratteri non validi
     <span style="color:green">✓</span> dovrebbe considerare le funzioni
     <span style="color:green">✓</span> dovrebbe considerare i segni
     <span style="color:green">✓</span> dovrebbe considerare la variabile x come un numero
     <span style="color:green">✓</span> dovrebbe calcolare il seguente esempio correttamente: -ln(x/2)*3^2/5-sin(1+x)

1. Componente ValutazioneSoggetto
     <span style="color:green">✓</span> Dovrebbe renderizzare il componente
     <span style="color:green">✓</span> Dovrebbe renderizzare colori differenti in base alla valutazione

1. Breadcrumb
     <span style="color:green">✓</span> dovrebbe visualizzare i breadcrumb correttamente
     <span style="color:green">✓</span> dovrebbe avere il numero corretto di elementi
     <span style="color:green">✓</span> dovrebbe avere i link corretti

1. Iscrizione Gara
     <span style="color:green">✓</span> Dovrebbe mostrare un messaggio di errore nel caso in cui non trova una gara
     <span style="color:green">✓</span> Dovrebbe mostrare il componente InfoGara

1. CarrelloItem
     <span style="color:green">✓</span> dovrebbe mostrare le informazioni del soggetto
     <span style="color:green">✓</span> dovrebbe chiamare onDelete quando si clicca sull'icona di rimozione
     <span style="color:green">✓</span> dovrebbe mostrare l'icona corretta in base al sesso

1. Info Covata page
     <span style="color:green">✓</span> Dovrebbe mostrare un messaggio di errore nel caso in cui non trova una covata
     <span style="color:green">✓</span> Dovrebbe mostrare il componente InfoCovata

1. Incassi
     <span style="color:green">✓</span> dovrebbe mostrare il titolo "Dettagli Gara"
     <span style="color:green">✓</span> dovrebbe mostrare il prezzo formattato correttamente
     <span style="color:green">✓</span> dovrebbe mostrare il numero di soggetti iscritti
     <span style="color:green">✓</span> dovrebbe calcolare e mostrare gli incassi correttamente

1. Componente ItemPdf
     <span style="color:green">✓</span> dovrebbe renderizzare correttamente i dati dell'item

1. \<InfoGabbia />
     <span style="color:green">✓</span> dovrebbe visualizzare il - se non è presente il numero della gabbia
     <span style="color:green">✓</span> dovrebbe visualizzare il numero di gabbia con l'icona
     <span style="color:green">✓</span> dovrebbe nascondere il numero di gabbia se è null

1. Componente SliderParentela
     <span style="color:green">✓</span> Dovrebbe renderizzare il componente
     <span style="color:green">✓</span> Dovrebbe effettuare il salvataggio del dato
 
 1. Evaluator
     <span style="color:green">✓</span> dovrebbe calcolare 5+7*2
     <span style="color:green">✓</span> dovrebbe calcolare 2^3+3/2+sqrt(4)+0.5
     <span style="color:green">✓</span> dovrebbe calcolare 0.125+sin(3.1415)*3/4^2/-2*ln(3)
     <span style="color:green">✓</span> dovrebbe calcolare una funzione con variabile
     <span style="color:green">✓</span> dovrebbe scoprire errori di sintassi
 
 1. Dequee - coda FIFO/LIFO
     <span style="color:green">✓</span> dovrebbe aggiungere due elementi alla coda (FIFO)
     <span style="color:green">✓</span> dovrebbe permettere operazioni FIFO
     <span style="color:green">✓</span> dovrebbe permettere operazioni LIFO

1. Componente GoogleCalendarLink
     <span style="color:green">✓</span> Dovrebbe renderizzare il componente
     <span style="color:green">✓</span> Dovrebbe renderizzare il pulsante disabilitato

1. Marketplace Page
     <span style="color:green">✓</span> Dovrebbe visualizzare la pagina Marketplace

1. Pagina Home
     <span style="color:green">✓</span> Dovrebbe effettuare il redirect alla home
     <span style="color:green">✓</span> Dovrebbe effettuare il redirect alla home

1. Impostazioni page
     <span style="color:green">✓</span> Dovrebbe mostrare la pagina impostazioni

1. Gare admin page
     <span style="color:green">✓</span> Dovrebbe visualizzare il componente GaraPage

1. Portafoglio
     <span style="color:green">✓</span> Dovrebbe renderizzare la pagina Portafoglio

1. Covate Page
     <span style="color:green">✓</span> Dovrebbe visualizzare il componente GaraPage

1. Componente Slider
     <span style="color:green">✓</span> Dovrebbe renderizzare il componente

1. Componente RegisterSent
     <span style="color:green">✓</span> dovrebbe mostrare il componente RegisterSent

1. Home Admin Page
     <span style="color:green">✓</span> Dovrebbe visualizzare la Home page dell'admin

1. GaraNonValida
     <span style="color:green">✓</span> dovrebbe mostrare il messaggio 'Gara non trovata'


<div style="text-align: center;">
  <div>
    <img src="/docs/img/coverage.png"/>
  </div>
  <sup style="font-style: italic;">Coverage dei test<sup>
</div>
