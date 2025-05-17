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

- Sviluppato iterativamente con cicli brevi (tipicamente una settimana)
- Mantenuto comunicazione costante con lo stakeholder (attraverso incontri frequenti e feedback immediato)
- Utilizzato il pair programming per le componenti critiche (il parser matematico e la logica di calcolo)
- Adottato test-driven development (scrittura dei test prima del codice)
- Effettuato refactoring continuo (miglioramento della struttura del codice ad ogni iterazione)

#### Planning e User Stories

##### Attività

1. **Sessione di planning con lo stakeholder**
    - **Dettagli**: Abbiamo incontrato l'allevatore (lo stakeholder) presso la sua struttura. La sessione è durata circa due ore e si è concentrata sulla comprensione dettagliata delle sue esigenze riguardo alla valutazione automatica. Sono state discusse le motivazioni dietro questa richiesta, i dati che considera importanti, e le sue aspettative sul livello di personalizzazione.
    <br>
    - **Output**:
      > **Punti Chiave Discussi:**
          - L'allevatore desidera un sistema flessibile per dare più peso ai risultati recenti.
          - Vuole poter considerare l'influenza genetica, dando più importanza ai parenti stretti (genitori, fratelli).
          - La possibilità di definire formule personalizzate è cruciale.
          - Deve poter visualizzare chiaramente il punteggio per ogni uccello.
          - Sarebbe utile un'anteprima di come le formule influenzano il risultato.
      >
      > **Domande Emerse:**
          - Quali funzioni matematiche dovrebbe supportare il sistema?
          - Come si intende bilanciare l'importanza del tempo e della parentela?

2. **Definizione delle user stories**
    - **Dettagli**: Basandosi sugli appunti della sessione di planning, abbiamo elaborato i requisiti in user stories. Ogni user story è stata scritta seguendo il formato standard "Come [tipo di utente], voglio [obiettivo] così che [beneficio]". Durante questa fase, si è discusso e chiarito ogni requisito per assicurarsi che fosse comprensibile e stimabile.
    <br>
    - **Output** (user stories prioritizzate):
      > **Titolo:** Formula Temporale
        **Come:** Allevatore
        **Voglio:** Definire una formula matematica che assegni un peso in base all'età del voto
        **Così che:** I voti più recenti possano avere maggiore o minore importanza.
        **Criteri di Accettazione:**
          - L'utente può inserire una formula matematica nel formato specificato.
          - Il sistema deve validare la sintassi della formula.
          - La formula deve poter utilizzare una variabile che rappresenti l'età del voto.
          - Il sistema deve fornire un feedback all'utente in caso di formula non valida.
        **Stima (punti storia):** 3
        **Priorità:** Alta
      
      > **Titolo:** Formula Parentela
        **Come:** Allevatore
        **Voglio:** Definire una formula matematica che assegni un peso in base al grado di parentela
        **Così che:** I voti di parenti più stretti possano avere maggiore o minore importanza.
        **Criteri di Accettazione:**
          - L'utente può inserire una formula matematica nel formato specificato.
          - Il sistema deve validare la sintassi della formula.
          - La formula deve poter utilizzare una variabile che rappresenti il grado di parentela.
          - Il sistema deve fornire un feedback all'utente in caso di formula non valida.
        **Stima (punti storia):** 3
        **Priorità:** Alta

      > **Titolo:** Bilanciamento dei fattori
        **Come:** Allevatore
        **Voglio:** Regolare un peso tra 0 e 1 (o una percentuale) quanto i due fattori incidano nel calcolo della valutazione finale
        **Così che:** Possa decidere cosa è più importante per me.
        **Criteri di Accettazione:**
          - L'utente può stabilire tramite uno slider una percentuale di suddivisione dei due fattori.
        **Stima (punti storia):** 1
        **Priorità:** Media

      > **Titolo:** Visualizzazione dei risultati
        **Come:** Allevatore
        **Voglio:** Vedere in modo chiaro la valutazione assegnata dal sistema ad ogni uccello.
        **Così che:** Possa capire meglio quali sono i soggetti più promettenti da far sviluppare.
        **Criteri di Accettazione:**
          - L'utente deve poter visualizzare nella scheda relativa al soggetto, la valutazione calcolata.
          - La valutazione potrebbe essere di colori differenti a seconda di quanto sia alta.
        **Stima (punti storia):** 2
        **Priorità:** Alta

      > **Titolo:** Anteprima formule
        **Come:** Allevatore
        **Voglio:** Visualizzare un anteprima delle formule immesse.
        **Così che:** Possa capire come e quanto i due parametri influenzano il calcolo.
        **Criteri di Accettazione:**
          - L'utente deve poter visualizzare un grafico per ogni formula.
          - Il grafico dovrebbe aggiornarsi in tempo reale ogni qualvolta la formula viene modificata.
          - Se la formula non è valida il grafico dovrebbe mostrare un messaggio di errore.
        **Stima (punti storia):** 2
        **Priorità:** Bassa

3. **Pianificazione delle iterazioni**
    - **Dettagli**: Abbiamo pianificato le iterazioni settimanali, assegnando le user stories a ciascuna iterazione in base alla priorità.
    <br>
    - **Output** (piano di iterazioni settimanali):
      > **Iterazione:** 1 (Durata: 1 settimana - dal 2025-03-03 al 2025-03-07)
        **Obiettivo:** Sviluppare il parser matematico di base.
      >
      >  **User Stories Assegnate:**
          - Formula Temporale (parte relativa all'inserimento e validazione della formula)
          - Formula Parentela (parte relativa all'inserimento e validazione della formula)
      
      > **Iterazione:** 2 (Durata: 1 settimana - dal 2025-03-10 al 2025-03-14)
        **Obiettivo:** Visualizzare la valutazione calcolata.
      >
      >  **User Stories Assegnate:**
          - Bilanciamento dei fattori (creazione dello slider)
          - Visualizzazione dei risultati (modificare l'interfaccia per visualizzare la valutazione calcolata)
      
      > **Iterazione:** 3 (Durata: 3 giorni - dal 2025-03-17 al 2025-03-19)
        **Obiettivo:** Visualizzare i grafici relativi alle formule in tempo reale.
      >
      >  **User Stories Assegnate:**
          - Anteprima formule

#### Iterazione 1: Sviluppo del Parser Matematico

##### Attività

1. **Analisi e progettazione del parser**
    - **Dettagli**: Abbiamo lavorato in pair programming per analizzare i requisiti delle user stories 1 e 2 (la parte relativa all'inserimento e validazione delle formule). È stata definita la grammatica che il parser avrebbe dovuto supportare, includendo numeri, variabili ('x' per il tempo o per la parentela), operatori (+, -, *, /, ^), parentesi e un set iniziale di funzioni matematiche comuni (es. log, sin, cos). Abbiamo inoltre discusso diversi approcci per l'implementazione del parser, optando per una combinazione di: tokenizer, algoritmo shunting-yard per la conversione in notazione polacca inversa (RPN), e un evaluator RPN. Successivamente abbiamo delineato i test di accettazione basati sui criteri definiti nelle user stories.
    <br>
    - **Output** (Diagramma di Classe Semplificato del Parser):
      ```javascript
      class Tokenizer {
        +tokenize(expression: string): List<Token>
      }
      class Evaluator {
        +evaluate(postfixTokens: List<Token>, variable: double): double
      }
      class Parser {
        //Interpreta la stringa di input e la trasforma in token ordinati secondo la RPN
        +parse(expression: string): List<Token>
      }
      ```

    - **Output** (Test di accettazione iniziali):
      > **Test Case 1**
        **Descrizione:** Verifica la validità di una formula semplice.
        **Passi:**
          1. L'utente inserisce la formula: `5 + 7 * 2`
          2. Il sistema analizza la formula.
        **Risultato Atteso:** La formula è considerata valida.
      
      > **Test Case 2**
        **Descrizione:** Verifica la gestione di una formula con parentesi.
        **Passi:**
          1. L'utente inserisce la formula: `( 5 ^ 2 ) ^ 3`
          2. Il sistema analizza la formula.
        **Risultato Atteso:** La formula è considerata valida.
      
      > **Test Case 3**
        **Descrizione:** Verifica la rilevazione di una formula non valida (operatore mancante).
        **Passi:**
          1. L'utente inserisce la formula: `( 5 + * 7 )`
          2. Il sistema analizza la formula.
        **Risultato Atteso:** Il sistema segnala un errore di sintassi.

2. **Implementazione del tokenizer**
    - **Dettagli**: Utilizzando TDD, uno dei due sviluppatori ha iniziato a scrivere i test per il tokenizer prima di implementare il codice vero e proprio. I test coprivano la corretta identificazione di numeri interi e decimali, la variabile 'x', le funzioni (ln, log, sin, cos), gli operatori aritmetici (+, -, *, /, ^) e le parentesi. Una volta scritti i test, ha implementato il tokenizer per farli passare.
    <br>
    - **Output** (Unit Test per il Tokenizer):
    ```typescript
      it("dovrebbe rilevare un numero", () => {
        const result = tokenize("25");
        expect(result.length).toBe(1);
        expect(result[0].value).toBe("25");
        expect(result[0].type).toBe(TokenEnum.NUMERO);
      });

      it("dovrebbe rilevare un addizione di due numeri", () => {
        const result = tokenize("25+50");
        expect(result.length).toBe(3);
        expect(result[0].value).toBe("25");
        expect(result[0].type).toBe(TokenEnum.NUMERO);
        expect(result[1].value).toBe("+");
        expect(result[1].type).toBe(TokenEnum.OPERATORE);
        expect(result[2].value).toBe("50");
        expect(result[2].type).toBe(TokenEnum.NUMERO);
      });

      it("dovrebbe gestire i numeri float con il .", () => {
        const result = tokenize("25.10");
        expect(result.length).toBe(1);
        expect(result[0].value).toBe("25.10");
        expect(result[0].type).toBe(TokenEnum.NUMERO);
      });

      it("dovrebbe generare un errore se ci sono più punti decimali", () => {
        expect(() => tokenize("25.1.0")).toThrow();
      });

      it("dovrebbe generare un errore se il punto decimale è posizionato all'inizio o alla fine", () => {
        expect(() => tokenize(".2510")).toThrow();
        expect(() => tokenize("2510.")).toThrow();
      });

      it("dovrebbe rilevare correttamente le parentesi", () => {
        const result1 = tokenize("(");
        const result2 = tokenize(")");
        expect(result1[0].type).toBe(TokenEnum.PARENTESI_APERTA);
        expect(result2[0].type).toBe(TokenEnum.PARENTESI_CHIUSA);
      });

      it("dovrebbe rilevare correttamente le funzioni", () => {
        const result = tokenize("sin");
        expect(result[0].type).toBe(TokenEnum.FUNZIONE);
        expect(result[0].value).toBe("sin");
      });

      it("dovrebbe ignorare gli spazi", () => {
        const result = tokenize("37 +   5.2  ");
        expect(result.length).toBe(3);
      });

      it("dovrebbe rilevare una x come variabile", () => {
        const result = tokenize("x");
        expect(result.length).toBe(1);
        expect(result[0].type).toBe(TokenEnum.VARIABILE);
        expect(result[0].value).toBe("x");
      });
    ```

    - **Output** (Implementazione del Tokenizer - frammento in pseudocodice):
    ```javascript
      classe Tokenizer:
        funzione tokenize(espressione):
            tokens = lista_vuota
            indice = 0
            finchè indice < lunghezza(espressione):
                carattere = espressione[indice]
                se carattere è cifra:
                    // Logica per estrarre il numero completo (intero o decimale)
                altrimenti se carattere è 'x':
                    // Crea un token di tipo VARIABLE
                altrimenti se carattere è un operatore (+, -, *, /, ^):
                    // Crea un token di tipo OPERATORE
                altrimenti se carattere è '(' o ')':
                    // Crea un token di tipo PARENTESI
                altrimenti se carattere è tra quelli di una funzione:
                    // Logica per estrarre la funzione completa
                indice = indice + 1
            return tokens
    ```

3. **Implementazione dell'algoritmo Shunting-yard**

    - **Dettagli**: L'altro sviluppatore del pair ha lavorato sull'implementazione dell'algoritmo shunting-yard. Anche in questo caso, si è partiti dalla scrittura dei test che verificavano la corretta conversione di espressioni infisse in notazione polacca inversa, gestendo la precedenza degli operatori (es. la moltiplicazione ha precedenza sull'addizione) e le parentesi.
    <br>
    - **Output** (Unit Test per il Parser):
    ```typescript
      it("converte una formula dal formato infix a postfix", () => {
        const output = parseToStr("5+3*8-4/2");
        expect(output).toBe("538*+42/-");
      });

      it("calcola l'ordine corretto dell'esponenziale", () => {
        const output1 = parseToStr("5^2^3");
        expect(output1).toBe("523^^");
        const output2 = parseToStr("2*5^2^3");
        expect(output2).toBe("2523^^*");
      });

      it("dovrebbe calcolare prima il risultato dell'espressione tra parentesi", () => {
        const output = parseToStr("(5^2)^3");
        expect(output).toBe("52^3^");
      });

      it("dovrebbe dare un errore se le parentesi non sono bilanciate", () => {
        expect(() => parseToStr("(5^2^3")).toThrow();
        expect(() => parseToStr("(5^2))^3")).toThrow();
      });

      it("dovrebbe dare un errore se l'espressione contiene caratteri non validi", () => {
        expect(() => parseToStr("(5^2)@^3")).toThrow();
      });

      it("dovrebbe considerare le funzioni", () => {
        const output = parseToStr("sin(5)+8");
        expect(output).toBe("5sin8+");
      });

      it("dovrebbe considerare i segni", () => {
        const output = parseToStr("-sin(-5)*+8");
        expect(output).toBe("5-sin-8+*");
      });

      it("dovrebbe considerare la variabile x come un numero", () => {
        const output = parseToStr("-sin(-x)*+8");
        expect(output).toBe("x-sin-8+*");
      });

      it("dovrebbe calcolare il seguente esempio correttamente: -ln(x/2)*3^2/5-sin(1+x)", () => {
        const output = parseToStr("-ln(x/2)*3^2/5-sin(1+x)");
        expect(output).toBe("x2/ln-32^*5/1x+sin-");
      });
    ```

    - **Output** (Implementazione dell'Algoritmo Shunting-yard - frammento in pseudocodice):
    ```javascript
      classe parser:
        funzione infixToPostfix(tokens_infix):
            output_queue = coda_vuota
            operator_stack = pila_vuota
            precedenza = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}

            per ogni token in tokens_infix:
                se token è un numero o una variabile:
                    aggiungi token a output_queue
                altrimenti se token è una funzione:
                    aggiungi token a operator_stack
                altrimenti se token è '(':
                    aggiungi token a operator_stack
                altrimenti se token è ')':
                    mentre cima di operator_stack non è '(':
                        sposta operatore da operator_stack a output_queue
                    rimuovi '(' da operator_stack
                    se cima di operator_stack è una funzione:
                        sposta funzione da operator_stack a output_queue
                altrimenti se token è un operatore:
                    mentre operator_stack non è vuota e cima di operator_stack è un operatore con precedenza >= precedenza di token:
                        sposta operatore da operator_stack a output_queue
                    aggiungi token a operator_stack

            mentre operator_stack non è vuota:
                sposta operatore da operator_stack a output_queue

            ritorna output_queue
    ```

4. **Sviluppo dell'evaluator RPN**

    - **Dettagli**: Lavorando insieme abbiamo poi implementato l'evaluator RPN. Anche qui, la metodologia TDD è stata seguita rigorosamente. I test si concentravano sulla corretta valutazione di espressioni in notazione polacca inversa, tenendo conto degli operatori e delle funzioni matematiche.
    <br>
    - **Output** (Unit Test per l'Evaluator RPN):
    ```typescript
      it("dovrebbe calcolare 5+7*2", () => {
        const res = evaluate("5+7*2");
        expect(res).toBe(19);
      });
      it("dovrebbe calcolare 2^3+3/2+sqrt(4)+0.5", () => {
        const res = evaluate("2^3+3/2+sqrt(4)+0.5");
        expect(res).toBe(12);
      });
      it("dovrebbe calcolare 0.125+sin(3.1415)*3/4^2/-2*ln(3)", () => {
        const res = evaluate("0.125+sin(3.1415)*3/4^2/-2*ln(3)");
        expect(res).toBeCloseTo(0.12499, 5);
      });
      it("dovrebbe calcolare una funzione con variabile", () => {
        const res1 = evaluate("(5+7-1*x)*2+x", 5);
        expect(res1).toBe(19);
        const res2 = evaluate("3*x", 0);
        expect(res2).toBe(0);
      });
      it("dovrebbe scoprire errori di sintassi", () => {
        expect(() => evaluate("(5+*7)")).toThrow();
        expect(() => evaluate("(5+7)+log(-3)")).toThrow();
        expect(() => evaluate("(5+7)+sqrt(-1)")).toThrow();
        expect(() => evaluate("(5+)7)")).toThrow();
        expect(() => evaluate("(5+x)7)")).toThrow();
      });
    ```

   - **Output** (Implementazione dell'Evaluator RPN - frammento in pseudocodice):
    ```javascript
      classe evaluator:
        funzione evaluate(tokens_postfix, variabile):
            stack = pila_vuota
            per ogni token in tokens_postfix:
                se token è un numero:
                    spingi token.valore nello stack (converti a numero)
                    altrimenti se token è una variabile:
                        spingi variables[token.valore] nello stack
                    altrimenti se token è un operatore:
                        operando2 = spingi da stack
                        operando1 = spingi da stack
                        risultato = applica operatore a operando1 e operando2
                        spingi risultato nello stack
                    altrimenti se token è una funzione:
                        se token.valore == "log":
                            operando = spingi da stack
                            spingi log(operando) nello stack
                        se ... // Altre funzioni...

                ritorna spingi da stack
    ```

5. **Refactoring e ottimizzazione**
    Al termine dell'implementazione e del superamento dei test, ci siamo dedicati al refactoring del codice. Questo ha comportato la revisione della struttura del codice per migliorarne la leggibilità, la rimozione di eventuali duplicazioni di codice e l'applicazione di principi di "clean code". Sono stati rinominati variabili e metodi per renderli più esplicativi.

##### Test

- Unit test per ogni componente del parser (tokenizer, parser, evaluator) sono stati eseguiti e superati.
- Test di integrazione sono stati creati per valutare il corretto funzionamento dell'intero processo di parsing ed evaluation su espressioni complete.
- Sono stati aggiunti test di edge case, come divisioni per zero (gestite con errori specifici) e formule vuote (gestite con un valore predefinito o un errore).

##### Output

- Parser matematico funzionante
- Suite di test automatizzati

#### Iterazione 2: Logica di Calcolo della Valutazione

##### Attività

1. **Progettazione dell'algoritmo di valutazione**

    - **Dettagli**: Ci siamo concentrati sulla definizione del flusso logico per calcolare la valutazione di un singolo uccello. Questo ha comportato l'identificazione dei dati necessari (voti storici, relazioni di parentela, date delle gare), la definizione di come applicare le formule temporali e di parentela, e come combinare i due pesi in base al fattore di bilanciamento fornito dall'utente. Sono stati creati diagrammi di flusso per visualizzare questo processo. Abbiamo successivamente iniziato a definire i test di accettazione per l'intero sistema di valutazione.
    <br>
    - **Output** (Diagramma di Flusso del Calcolo della Valutazione):
      ```mermaid
        %%{init: {'themeVariables': { 'fontSize': '10px' }}}%%
        graph TD
          A[Inizio Calcolo Valutazione del soggetto X] --> B[Recupera Voti e Relazioni di Parentela]
          B --> C[Recupera Voti di tutti i parenti di X]
          C --> D[Per ogni Voto di X e parenti:<br/>- Calcola Peso Temporale]
          D --> E[Calcola media pesata]
          C --> F[Per ogni Voto di X e parenti:<br/>- Calcola Peso Parentela]
          F --> G[Calcola media pesata]
          E --> H
          G --> H[Applica bilanciamento]
          H --> I[Output: Valutazione Finale di X]
        ```
    - **Output** (Test di Accettazione Iniziali per la Valutazione):
        ```typescript
        it("calcola correttamente le valutazioni di due voti distanti un anno", async () => {
          const now = new Date();
          const unAnnoFa = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate()
          );

          // USER MOCK
          const mockUser = {
            ...mockProfilo,
            formulaData: "1 - 0.8 * x",
          };
          vi.spyOn(auth, "getServerUserProfile").mockResolvedValue(mockUser);

          // SOGGETTI
          vi.spyOn(prismaClient.prisma.soggetto, "findMany").mockResolvedValue(
            mockSoggetti
          );

          // GARE
          const mockIscrizioni = [
            {
              id: "iscrizione-1",
              soggettoId: mockSoggetti[0].id,
              voto: 80,
              gara: {
                ...mockGara,
                data: now,
              },
            },
            {
              id: "iscrizione-2",
              soggettoId: mockSoggetti[0].id,
              voto: 100,
              gara: {
                ...mockGara,
                data: unAnnoFa,
              },
            },
          ];
          vi.spyOn(prismaClient.prisma.iscrizione, "findMany").mockResolvedValue(
            mockIscrizioni
          );

          // CHIAMATA
          const response = await GET();
          const json = await response.json();

          // ASSERT
          expect(response.status).toBe(200);
          expect(json.error).toBe(false);
          expect(json.result).toBeDefined();
          expect(json.result[mockSoggetti[0].id]).toBeLessThan(90);
        });

        it("calcola correttamente le valutazioni di due voti tra genitore e figlio", async () => {
          const now = new Date();

          // USER MOCK
          const mockUser = {
            ...mockProfilo,
            formulaParentela: "1 - 0.8 * x",
          };
          vi.spyOn(auth, "getServerUserProfile").mockResolvedValue(mockUser);

          // SOGGETTI
          mockSoggetti[0].covata = {
            idPadre: soggetti[1].id,
            idMadre: soggetti[2].id,
          };
          vi.spyOn(prismaClient.prisma.soggetto, "findMany").mockResolvedValue(
            mockSoggetti
          );

          // GARE
          const mockIscrizioni = [
            {
              id: "iscrizione-1",
              soggettoId: mockSoggetti[0].id,
              voto: 80,
              gara: {
                ...mockGara,
                data: now,
              },
            },
            {
              id: "iscrizione-2",
              soggettoId: mockSoggetti[1].id,
              voto: 100,
              gara: {
                ...mockGara,
                data: now,
              },
            },
          ];
          vi.spyOn(prismaClient.prisma.iscrizione, "findMany").mockResolvedValue(
            mockIscrizioni
          );

          // CHIAMATA
          const response = await GET();
          const json = await response.json();

          // ASSERT
          expect(response.status).toBe(200);
          expect(json.error).toBe(false);
          expect(json.result).toBeDefined();
          expect(json.result[mockSoggetti[0].id]).toBeLessThan(90);
        });
        ```
  
2. **Implementazione del calcolo dei pesi**

   - **Dettagli**: Utilizzando il parser sviluppato nell'iterazione precedente, è stata implementata la logica per calcolare i pesi temporali e di parentela per ogni voto. Questo ha comportato l'integrazione del parser con i dati recuperati (età del voto e grado di parentela) e l'applicazione delle formule definite dall'utente. È stata anche implementata la logica per combinare i due pesi in base al fattore di bilanciamento fornito dall'utente.
    <br>
    - **Output** (Funzione per il Calcolo del Peso Temporale - pseudocodice):
      ```
      funzione calcolaPesoTemporale(formula_utente, data_voto):
          eta_in_anni = calcolaDifferenzaAnni(data_corrente, data_voto)
          risultato = Parser.evaluate(formula_utente, eta_in_anni)
          ritorna risultato
      ```
    - **Output** (Funzione per il Calcolo del Peso di Parentela - pseudocodice):
      ```
      funzione calcolaPesoParentela(formula_utente, grado_parentela):
          risultato = Parser.evaluate(formula_utente, grado_parentela)
          ritorna risultato
      ```
    - **Output** (Funzione per la Combinazione dei Pesi - pseudocodice):
      ```
      funzione combinaPesi(peso_temporale, peso_parentela, bilanciamento_tempo):
            peso_combinato = (peso_temporale * bilanciamento_tempo) + (peso_parentela * (1 - bilanciamento_tempo))
            ritorna peso_combinato
      ```

3. **Refactoring e finalizzazione**
   - **Dettagli**: È stato rivisto il codice implementato per assicurarsi che fosse ben strutturato, facile da leggere e manutenere. Sono stati risolti i bug identificati durante i test unitari e di integrazione.

##### Test

- Sono stati scritti unit test per testare le singole funzioni di calcolo dei pesi e la logica di combinazione.
- Sono stati creati test di integrazione per verificare il flusso completo del calcolo della valutazione per un uccello, dall'accesso ai dati all'applicazione delle formule e al bilanciamento.
- Sono stati inoltre inclusi test per scenari con dati mancanti o non validi.

#### Iterazione 3: Sviluppo dell'Interfaccia Utente

##### Attività

1. **Progettazione dell'esperienza utente**

    - **Dettagli**: Un designer UI/UX (spesso uno degli sviluppatori in XP) ha lavorato alla creazione di wireframe e mockup interattivi per la sezione di configurazione delle formule e per la visualizzazione dei risultati. L'obiettivo era rendere l'interfaccia intuitiva e facile da usare per l'allevatore. Sono stati considerati diversi layout e flussi di interazione.
    <br>
    - **Output** (Wireframe dell'interfaccia):
    <img src="/docs/img/UI_Wireframe.jpg"/>

2. **Implementazione sezione di configurazione**

   - **Dettagli**: Abbiamo implementato l'interfaccia utente per consentire all'allevatore di inserire le formule per il peso temporale e il peso della parentela, e di regolare il bilanciamento tra i due fattori tramite uno slider. È stato implementato un sistema di validazione in tempo reale per fornire feedback immediato sull'eventuale presenza di errori di sintassi nelle formule.
    <br>
    - **Output** (Interfaccia implementata):
    <img src="/docs/img/UI_Formule_valutazione.jpg"/>

3. **Implementazione visualizzazione grafica**

   - **Dettagli**: È stata sviluppata la funzionalità per visualizzare graficamente l'effetto delle formule inserite. Per la formula temporale, un grafico mostra come il peso varia in funzione dell'età del voto. Per la formula di parentela, un grafico mostra come il peso varia in base ai diversi gradi di parentela definiti nel sistema. L'interfaccia viene aggiornata in tempo reale al variare delle formule.
    <br>
    - **Output** (Interfaccia implementata):
    <img src="/docs/img/UI_Formule_completa.png"/>

4. **Implementazione visualizzazione risultati**

   - **Dettagli**: La valutazione calcolata per ogni uccello è stata integrata nella visualizzazione principale degli esemplari (nella scheda dell'uccello). Per una più facile accessibilità il colore della valutazione varia a seconda di quanto è alto il punteggio calcolato.
    <br>
    - **Output** (Interfaccia implementata):
    <img src="/docs/img/Visualizzazione_valutazione.jpg"/>

5. **Refactoring e accessibilità**
   - **Dettagli:** Il codice dell'interfaccia è stato rivisto per migliorarne la leggibilità e la manutenibilità. L'interfaccia è stata testata su diverse dimensioni dello schermo per garantirne la responsività.

##### Test

- Sono stati condotti test di usabilità con utenti reali per raccogliere feedback sull'intuitività dell'interfaccia.
- Sono stati eseguiti test di accessibilità per identificare e correggere eventuali problemi.
- Sono stati effettuati test di compatibilità cross-browser per assicurare che l'interfaccia funzionasse correttamente sui browser più comuni.

#### Iterazione 5: Integrazione, Testing e Rilascio

##### Attività

1. **Integrazione completa del sistema**

   - **Dettagli:** Tutti i componenti sviluppati nelle iterazioni precedenti (parser, logica di calcolo, interfaccia utente) sono stati integrati in un unico sistema funzionante. Questo ha comportato la risoluzione di eventuali conflitti tra i diversi moduli e la verifica che tutti i componenti interagissero correttamente.

2. **Testing approfondito**

   - **Dettagli:** Sono stati eseguiti test di regressione per assicurarsi che le nuove funzionalità non avessero introdotto bug nel codice esistente. Sono stati condotti test di accettazione con gli utenti finali (l'allevatore) per verificare che il sistema soddisfacesse i requisiti definiti nelle user stories e che fosse facile da usare.

3. **Preparazione al rilascio**

   - **Dettagli:** È stato pianificato il processo di deployment, inclusi gli orari e le comunicazioni all'allevatore.

4. **Rilascio e monitoraggio**
   - **Dettagli:** La nuova versione dell'applicazione è stata rilasciata nell'ambiente di produzione. Sono stati raccolti i feedback iniziali dell'allevatore sulla nuova funzionalità.

##### Test

- I test di accettazione finali con l'allevatore hanno avuto esito positivo.

<br>

#### Retrospettiva del Progetto

##### Successi

- Il sistema di valutazione funziona correttamente e offre un elevato grado di personalizzazione grazie alla possibilità di definire formule matematiche complesse.
- L'interfaccia utente per la configurazione e la visualizzazione dei risultati è risultata intuitiva e facile da usare nei test con gli utenti.
- L'approccio iterativo di XP ha permesso di ottenere feedback frequenti e di adattare lo sviluppo in base alle esigenze dello stakeholder.

##### Sfide

- La complessità del parser matematico ha richiesto più tempo del previsto, specialmente nella gestione di funzioni avanzate e nella robustezza contro input non validi.
- Alcuni edge case nelle formule definite dagli utenti (ad esempio, divisioni per zero o errori di sintassi complessi) hanno richiesto una gestione specifica e test aggiuntivi.
- L'integrazione del nuovo sistema di valutazione con il modello dati esistente per i voti e le relazioni di parentela ha presentato alcune difficoltà impreviste che hanno richiesto modifiche allo schema.

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
