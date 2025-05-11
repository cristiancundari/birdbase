Lo sviluppo del software si è basato molto sul coinvolgimento con il cliente e rilasci continui in modo tale da poter essere testato e ottenere feedback sulle funzionalità implementate.

#### Rilascio #1

Per il primo rilascio il lavoro si è concentrato sulla creazione delle fondamenta del progetto installando il framework di sviluppo e le dipendenze principali per creare una Web-App. Successivamente analizzando i casi d'uso e le user stories, abbiamo deciso di implementare per prima la funzione di login all'applicazione, che sebbene possa non essere considerata una funzione principale e utile all'utente in un primo momento, risulta invece utile a definire delle linee guida in termini di sicurezza per l'interazione tra il front-end e il back-end.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/login.png" height="450px"/>
  </div>
  <sup style="font-style: italic;">Pagina di login<sup>
</div>

#### Rilascio #2
Nel rilascio numero due ci siamo focalizzati nell'implementazione delle funzionalità per la registrazione a sistema dei soggetti.
Inizialmente è stata realizzata l'interfaccia grafica del componente che rappresenta un singolo soggetto, utilizzando momentaneamente dati fittizi.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/soggettoCompSenzaPreferito.png"/>
  </div>
  <sup style="font-style: italic;">UI Soggetto<sup>
</div>

&nbsp;
Successivamente è stato realizzato il collegamento con il back-end ottenendo i dati dal database e sono state implementate le funzioni di Aggiunta di un nuovo soggetto e di modifica.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/modalAggiungiSoggetto.png" height="600px"/>
  </div>
  <sup style="font-style: italic;">Modal di aggiunta/modifica soggetto<sup>
</div>

&nbsp;
Per ultime sono state sviluppate la funzione di eliminazione, e sotto richiesta del cliente, due nuove funzionalità:

- **Preferito** - per poter classificare il soggetto come preferito
- **Morto** - in caso in cui il soggeto sia deceduto

<div style="text-align: center;">
  <div>
    <img src="/docs/img/soggettoCompMortoPreferito.png"/>
  </div>
  <sup style="font-style: italic;">UI Soggetto con funzioni di Preferito e Morto<sup>
</div>

#### Rilascio #3
Una volta implementata la pagina per visualizzare i soggetti, ci siamo dedicati alla pagina relativa alla gestione delle finanze in quanto il cliente ci ha espresso la sua necessità per monitorare le spese relative all'allevamento.
Abbiamo dunque realizzato: una sezione **Budget** dove l'utente può inserire la cifra che intende dedicare mensilmente al mantenimento dell'allevamento; una sezione **Transazioni** che permette di visualizzare o aggiungere nuove transazioni, e una sezione relatavia ai "Grafici":

1.  Un grafico a torta indica le spese sostenute, suddivise per categoria, durante un anno specifico selezionabile
2.  Un istogramma indica gli incassi, suddivisi per mese di riferimento, nell'arco di un anno specifico

<div style="text-align: center;">
  <div>
    <img src="/docs/img/portafoglioPage.png"/>
  </div>
  <sup style="font-style: italic;">Pagina Portafoglio<sup>
</div>

#### Rilascio #4

Dopo il rilascio di questa feature, il cliente ha richiesto la possibilità di poter effettuare report di qualsiasi arco temporale e per qualsiasi tipo di transazione (spese, incassi o entrambi).
Abbiamo dunque aggiunto un pulsante che apre una finestra in cui l'utente può personalizzare il report che vuole generare scegliendo l'arco temporale di interesse e la tipologia di transazione. Il report potrà all'occorrenza essere stampato.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/report.png"/>
  </div>
  <sup style="font-style: italic;">Esempio di report<sup>
</div>

#### Rilascio #5
Nel rilascio numero quattro ci siamo focalizzati nell'implementazione delle funzionalità per la registrazione delle covate.
Inizialmente è stata realizzata l'interfaccia grafica del componente che rappresenta una singola covata.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/covataComp.png"/>
  </div>
  <sup style="font-style: italic;">UI Covata<sup>
</div>

Successivamente è stato realizzato il collegamento con il back-end ottenendo i dati dal database, e sono state implementate le funzioni di aggiunta, modifica ed eliminazione.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/modalCovata.png"/>
  </div>
  <sup style="font-style: italic;">Modal di aggiunta/modifica covata<sup>
</div>

#### Rilascio #6

Il rilascio numero cinque, si è basato sul controllo della parentala tra padre, madre e viceversa.
Il controllo infatti, avviene ogni volta che viene modificato il valore nella selezione di riferimento. In questo modo l'allevatore è facilitato nella scelta evitando l'accoppiamento di soggetti con legami parentali più stretti.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/modalPadreMadre.png"/>
  </div>
  <sup style="font-style: italic;">Info Parentela<sup>
</div>

#### Rilascio #7

Nella sezione delle informazioni di una covata, è stata implementata la possibilità di aggiungere i figli ad essa. Questo processo può avvenire in due modi differenti:

1.  **Creazione ex-novo del soggetto** - permette all'allevatore di inserire un nuovo soggetto direttamente dalla pagina della covata.
2.  **Scelta di un soggetto** - permette all'allevatore di scegliere un soggetto già presente nel sistema.

Una volta che il numero dei figli di una covata è uguale al numero di uova deposte, il pulsante che permette di aggiungere nuovi figli sarà disabilitato.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/aggiuntaFigli.png"/>
  </div>
  <sup style="font-style: italic;">Pagina Info Covata<sup>
</div>

#### Rilascio #8

Il seguente rilascio si è concentrato sull'implementazione delle funzioni di Creazione, Modifica ed Eliminazione di promemoria: Gli utenti possono ora creare nuovi promemoria, modificarli o eliminarli direttamente dall'interfaccia. Ogni promemoria può includere un titolo, una descrizione, una data e una priorità ed è inoltre possibile per l'allevatore impostare il promemoria come completato.

<div style="display: flex; justify-content: center; align-items: center; gap: 100px">
  <div style="text-align: center;">
    <div>
      <img src="/docs/img/pagina_promemoria.png"/>
    </div>
    <sup style="font-style: italic;">Pagina gestione promemoria<sup>
  </div>
  <div style="text-align: center;">
    <div>
      <img src="/docs/img/promemoria.png"/>
    </div>
    <sup style="font-style: italic;">Modal di aggiunta promemoria<sup>
  </div>
</div>

È stato poi resa disponibile la possibilità di sincronizzare con Google Calendar i promemoria.
Per poter realizzare questa funzionalità, l'allevatore deve prima avere la possibilità di associare il proprio account Google al sistema.
Fatto questo, se l'utente completa la procedura di associazione a Google Calendar, i promemoria creati all'interno dell'applicazione verranno automaticamente aggiunti al calendario Google dell'utente. Inoltre, le modifiche ai promemoria verranno sincronizzate in tempo reale.
Ogni qualvolta il sistema opera sui promemoria, verifica se esiste già su Google un calendario dedicato all'applicazione ("BirdBase"). Se il calendario non esiste, il sistema lo crea automaticamente prima di effettuare le operazioni sui promemoria.

#### Rilascio #9

In questo rilascio abbiamo introdotto la funzionalità di compravendita dei soggetti. Gli allevatori hanno ora la possibilità di creare annunci di vendita per i propri soggetti direttamente dalla piattaforma. Un altro allevatore può visualizzare gli annunci e acquistare i soggetti in vendita tramite un processo di pagamento integrato. L'acquisto avviene comodamente tramite PayPal, garantendo transazioni sicure e senza interruzioni. Una volta effettuato l'acquisto, l'acquirente vedrà il soggetto acquistato nella propria pagina di gestione dei soggetti; mentre a entrambi gli allevatori viene aggiunta una transazione nella propria sezione portafoglio di spesa (per l'acquirente) e incasso (per il venditore).

<div style="text-align: center;">
  <div>
    <img src="/docs/img/marketplace.png"/>
  </div>
  <sup style="font-style: italic;">Esempio di inserzione<sup>
</div>

#### Rilascio #10

Nel seguente rilascio abbiamo introdotto una nuova funzionalità per permettere agli allevatori di registrarsi facilmente sulla piattaforma. Gli allevatori possono adesso completare il processo di registrazione inviando tutti i dati richiesti, insieme alla documentazione necessaria: il certificato di registrazione alla FOI e un documento di identità valido.

Una volta inviata la richiesta, l’amministratore avrà la possibilità di visionare i documenti e decidere se accettare o rifiutare la registrazione. In caso di esito positivo, il sistema invierà automaticamente un’email di benvenuto all’allevatore con la password di accesso. Se invece la documentazione risulta incompleta o non conforme, verrà inviata una comunicazione via email che spiega il motivo del rifiuto, indicando la documentazione mancante.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/form di registrazione.png"/>
  </div>
  <sup style="font-style: italic;">Form di registrazione<sup>
</div>

<div style="text-align: center; margin-top: 80px;">
  <div>
    <img src="/docs/img/gestione registrazioni.png"/>
  </div>
  <sup style="font-style: italic;">Pagina di gestione delle registrazioni dell'admin<sup>
</div>

#### Rilascio #11

In questo rilascio abbiamo implementato una funzionalità che consente all’amministratore di creare, eliminare e modificare le gare all’interno della piattaforma. Grazie a questa nuova gestione, l’amministratore ha il pieno controllo sulle gare, con la possibilità di definire uno stato per ogni evento. In particolare, l’amministratore può ad esempio marcare una gara come “bozza”.
Le gare in stato di bozza non saranno visibili agli allevatori, mentre solo quelle confermate saranno visibili e accessibili, evitando così che gli utenti visualizzino eventi non ancora definitivi o pronti per la partecipazione.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/modal_gare.png"/>
  </div>
  <sup style="font-style: italic;">Modal per aggiungere una nuova gara<sup>
</div>

<div style="text-align: center;">
  <div>
    <img src="/docs/img/gare.png"/>
  </div>
  <sup style="font-style: italic;">Pagina di gestione gare<sup>
</div>

#### Rilascio #12

Una volta che abbiamo reso possibile all'amministratore la gestione delle gare, abbiamo deciso, insieme al cliente, di implementare la possibilità che gli allevatori iscrivano i propri soggetti alle gare. Ora gli allevatori possono accedere alla gara di interesse, selezionare i soggetti che desiderano iscrivere tramite un comodo menu a tendina e completare il pagamento tramite PayPal in autonomia.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/iscrizionegare.png"/>
  </div>
  <sup style="font-style: italic;">Pagina di iscrizione a una gara<sup>
</div>

#### Rilascio #13

Per completare la gestione delle gare, abbiamo implementato la funzionalità che permette all’amministratore di inserire le valutazioni per i soggetti partecipanti così da generare una classifica finale e segnare la gara come completata. Una volta che la gara è stata conclusa, la classifica sarà visibile agli allevatori, mostrando non solo le posizioni generali, ma anche i posizionamenti specifici dei propri soggetti, consentendo un monitoraggio dettagliato dei risultati.

Inoltre, su richiesta dello stakeholder, è stata aggiunta in ultimo una nuova funzionalità: la possibilità di condividere i risultati sui social. Gli allevatori che vedranno i propri soggetti posizionarsi nella gara potranno ora condividere facilmente i risultati sui principali social, dando visibilità ai successi raggiunti e promuovendo ulteriormente il proprio allevamento.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/classificagara.png"/>
  </div>
  <sup style="font-style: italic;">Visualizzazione classifica generale e personale<sup>
</div>

<div style="text-align: center; margin-top: 50px;">
  <div>
    <img src="/docs/img/risultatogara.png"/>
  </div>
  <sup style="font-style: italic;">Pagina visualizzata cliccando il link condiviso sul social<sup>
</div>

#### Rilascio #14

In questo rilascio abbiamo introdotto la funzionalità della chat, che permette sia agli amministratori che agli allevatori di comunicare facilmente tra di loro. Entrambi gli utenti possono inviare e ricevere messaggi in tempo reale, con la possibilità di visualizzare un badge di notifica ogni volta che ricevono un nuovo messaggio, migliorando la tempestività e l’efficienza delle comunicazioni.

Inoltre, è stata introdotta la possibilità di creare canali di chat. Sia gli amministratori che gli allevatori possono creare delle chat di gruppo assegnando un nome al canale e aggiungendo i partecipanti desiderati. Questa funzionalità può essere ad esempio utile all'amministratore per creare un canale inerente a una determinata gara per gestire la logistica.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/chat.png"/>
  </div>
  <sup style="font-style: italic;">Pagina Chat per messaggiare con altri utenti<sup>
</div>

<div style="text-align: center; margin-top: 50px;">
  <div>
    <img src="/docs/img/modalcanale.png"/>
  </div>
  <sup style="font-style: italic;">Modal di creazione nuovo canale<sup>
</div>

#### Rilascio #15

Nel rilascio di oggi, abbiamo introdotto due nuove funzionalità pensate per migliorare l’esperienza degli utenti sulla piattaforma. La prima riguarda la possibilità per gli utenti di modificare la propria password in modo semplice e sicuro, rendendo più facile la gestione dell’accesso e garantendo una maggiore protezione dei dati personali.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/cambiopassword.png"/>
  </div>
  <sup style="font-style: italic;">Modal per permettere il cambio password<sup>
</div>

&nbsp;

Inoltre, seguendo una richiesta dello stakeholder, abbiamo aggiunto una nuova sezione di commenti, esclusivamente per le gare. Gli allevatori ora possono lasciare commenti sulle gare a cui hanno partecipato o su quelle di interesse, offrendo così uno spazio per condividere opinioni, feedback o esperienze. Non solo è possibile scrivere commenti, ma gli utenti possono anche semplicemente reagire utilizzando emoji.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/disqus.png"/>
  </div>
  <sup style="font-style: italic;">Sezione commenti di una gara<sup>
</div>

#### Rilascio #16: Sistema di Valutazione Automatica per Allevatori

#### Introduzione

Il rilascio numero 16 introduce una funzionalità avanzata di valutazione automatica degli uccelli in allevamento, basata sui voti ricevuti nelle gare. Il sistema calcola un punteggio personalizzato considerando sia i voti diretti del soggetto che quelli dei suoi parenti, applicando pesi che variano in base a:

- Fattore temporale: quanto è recente la gara
- Grado di parentela: quanto è stretto il legame genetico

Gli allevatori possono personalizzare completamente il sistema definendo le formule matematiche per il calcolo dei pesi e bilanciando l'importanza relativa dei due fattori.

#### Approccio XP

Seguendo i principi dell'Extreme Programming, abbiamo:

- Sviluppato iterativamente con cicli brevi
- Mantenuto comunicazione costante con lo stakeholder
- Utilizzato il pair programming per le componenti critiche
- Adottato test-driven development
- Effettuato refactoring continuo

#### Iterazione 1: Planning e User Stories

##### Attività

1. **Sessione di planning con lo stakeholder**

   - Incontro con l'allevatore nonchè stakeholder del progetto
   - Identificazione delle esigenze chiave e aspettative

2. **Definizione delle user stories**

   - Elaborazione dei requisiti in forma di user stories
   - Prioritizzazione delle funzionalità

3. **Stima e pianificazione delle iterazioni**
   - Stima dello sforzo per ogni user story
   - Definizione della roadmap di sviluppo

##### User Stories Identificate

1. **Formula Temporale**: "Come allevatore, voglio definire una formula matematica che assegni un peso in base all'età del voto, così che i voti più recenti possano avere maggiore o minore importanza."

2. **Formula di Parentela**: "Come allevatore, voglio definire una formula matematica che assegni un peso in base al grado di parentela, così che i voti di parenti stretti o lontani abbiano l'importanza che ritengo appropriata."

3. **Bilanciamento dei Fattori**: "Come allevatore, voglio regolare l'importanza relativa tra fattore temporale e parentela, così da personalizzare la valutazione in base alla mia strategia di allevamento."

4. **Visualizzazione Risultati**: "Come allevatore, voglio vedere la valutazione calcolata per ogni soggetto, così da identificare facilmente gli esemplari più promettenti."

5. **Anteprima Formule**: "Come allevatore, voglio visualizzare graficamente l'effetto delle mie formule, così da comprendere meglio come influenzano il calcolo."

##### Output

- Backlog di user stories prioritizzate
- Piano di iterazioni settimanali

#### Iterazione 2: Sviluppo del Parser Matematico

##### Attività

1. **Analisi e progettazione del parser**

   - Definizione dei requisiti del parser
   - Individuazione degli algoritmi appropriati
   - Creazione dei test di accettazione

2. **Implementazione del tokenizer**

   - Sviluppo TDD del tokenizer per identificare:
     - Numeri (interi e decimali)
     - Variabili (tempo, parentela)
     - Operatori matematici (+, -, \*, /, ^)
     - Funzioni (log, sin, cos, ecc.)
     - Parentesi

3. **Implementazione dell'algoritmo Shunting-yard**

   - Sviluppo TDD della conversione da notazione infissa a RPN
   - Gestione delle precedenze tra operatori
   - Supporto per funzioni nidificate

4. **Sviluppo dell'evaluator RPN**

   - Implementazione del valutatore di espressioni
   - Supporto per funzioni matematiche avanzate
   - Gestione degli errori di calcolo

5. **Refactoring e ottimizzazione**
   - Revisione del codice per migliorare leggibilità e prestazioni
   - Eliminazione di duplicazioni

##### Test

- Unit test per ogni componente del parser
- Test di integrazione per valutare espressioni complete
- Test di edge case e gestione errori

##### Output

- Parser matematico funzionante
- Documentazione tecnica del parser
- Suite di test automatizzati

#### Iterazione 3: Logica di Calcolo della Valutazione

##### Attività

1. **Progettazione dell'algoritmo di valutazione**

   - Definizione del flusso di calcolo
   - Identificazione dei dati necessari
   - Creazione dei test di accettazione

2. **Implementazione dell'accesso ai dati**

   - Sviluppo dell'interfaccia per recuperare:
     - Voti storici degli esemplari
     - Relazioni di parentela
     - Date delle mostre

3. **Implementazione del calcolo dei pesi**

   - Sviluppo della logica per calcolare:
     - Peso temporale tramite la formula utente
     - Peso di parentela tramite la formula utente
     - Combinazione pesata dei due fattori

4. **Refactoring e finalizzazione**
   - Miglioramento della struttura del codice
   - Risoluzione dei bug identificati

##### Test

- Unit test per i singoli componenti di calcolo
- Test di integrazione per il flusso completo
- Test di performance con dataset di grandi dimensioni

##### Output

- Sistema di calcolo funzionante
- Documentazione algoritmica
- Suite di test automatizzati

#### Iterazione 4: Sviluppo dell'Interfaccia Utente

##### Attività

1. **Progettazione dell'esperienza utente**

   - Wireframing della sezione di configurazione
   - Definizione del flusso di interazione
   - Creazione dei mockup interattivi

2. **Implementazione sezione di configurazione**

   - Sviluppo dei campi di input per le formule
   - Implementazione dello slider di bilanciamento
   - Creazione del sistema di validazione in tempo reale

3. **Implementazione visualizzazione grafica**

   - Sviluppo dei grafici per l'anteprima delle formule
   - Implementazione dell'aggiornamento in tempo reale
   - Ottimizzazione della reattività dell'interfaccia

4. **Implementazione visualizzazione risultati**

   - Integrazione della valutazione nella scheda dell'esemplare
   - Implementazione di tooltip informativi

5. **Refactoring e accessibilità**
   - Miglioramento dell'accessibilità dell'interfaccia
   - Ottimizzazione per diverse dimensioni dello schermo
   - Pulizia del codice dell'interfaccia

##### Test

- Test di usabilità con utenti reali
- Test di accessibilità
- Test di compatibilità cross-browser

##### Output

- Interfaccia utente completa e funzionante
- Documentazione dell'interfaccia
- Feedback degli utenti

#### Iterazione 5: Integrazione, Testing e Rilascio

##### Attività

1. **Integrazione completa del sistema**

   - Connessione di tutti i componenti
   - Risoluzione dei conflitti di integrazione
   - Verifica della coerenza del sistema

2. **Testing approfondito**

   - Esecuzione di test di regressione
   - Test di accettazione con utenti finali

3. **Preparazione al rilascio**

   - Creazione dello script di migrazione
   - Pianificazione del deployment

4. **Rilascio e monitoraggio**
   - Deployment in produzione
   - Monitoraggio attivo del sistema
   - Raccolta feedback iniziali

##### Test

- Test di accettazione finali

##### Output

- Sistema completo pronto per il rilascio
- Documentazione completa

#### Retrospettiva del Progetto

##### Successi

- Il sistema di valutazione funziona correttamente e offre alta personalizzazione
- L'interfaccia utente è risultata intuitiva nei test con gli utenti

##### Sfide

- La complessità del parser matematico ha richiesto più tempo del previsto
- Alcuni edge case nelle formule hanno richiesto gestione specifica
- L'integrazione con il sistema esistente ha presentato alcune difficoltà impreviste

##### Lezioni Apprese

- Il pair programming è stato fondamentale per risolvere i problemi complessi
- Il TDD ha ridotto significativamente i difetti nel codice finale
- Il coinvolgimento costante degli utenti ha permesso di affinare l'interfaccia

##### Prossimi Passi

- Monitorare l'adozione della funzionalità
- Raccogliere feedback per miglioramenti futuri
- Pianificare l'espansione con funzionalità correlate

#### Conclusione

Grazie all'approccio XP, abbiamo consegnato una funzionalità complessa e personalizzabile che offre un valore significativo agli allevatori. La natura iterativa e collaborativa del processo ha permesso di affrontare efficacemente le sfide tecniche mantenendo il focus sul valore per l'utente finale.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/funzioni valutazione.png"/>
  </div>
  <sup style="font-style: italic;">Scelta funzioni da utilizzare per la valutazione dei soggetti<sup>
</div>
