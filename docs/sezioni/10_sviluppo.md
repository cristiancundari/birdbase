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

1.  **Piechart** - indica le spese sostenute, suddivise per categoria, durante un anno specifico selezionabile
2.  **Barchart** - indica gli incassi, suddivisi per mese di riferimento, nell'arco di un anno specifico

<div style="text-align: center;">
  <div>
    <img src="/docs/img/portafoglioPage.png"/>
  </div>
  <sup style="font-style: italic;">Pagina Portafoglio<sup>
</div>

Dopo il rilascio di questa feature, il cliente ha richiesto la possibilità di poter effettuare report di qualsiasi arco temporale e per qualsiasi tipo di transazione (spese, incassi o entrambi).
Abbiamo dunque aggiunto un pulsante per generare il report che dopo aver visualizzato un modal, dove l'utente può scegliere l'arco temporale di interesse e la tipologia di transazione, potrà essere all'occorrenza stampato.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/report.png"/>
  </div>
  <sup style="font-style: italic;">Esempio di report<sup>
</div>

#### Rilascio #4
Nel rilascio numero quattro ci siamo focalizzati nell'implementazione delle funzionalità per la registrazione delle covate.
Inizialmente è stata realizzata l'interfaccia grafica del componente che rappresenta una singola covata.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/covataComp.png"/>
  </div>
  <sup style="font-style: italic;">UI Covata<sup>
</div>

Successivamente è stato realizzato il collegamento con il back-end ottenendo i dati dal database e sono state implementate le funzioni di Aggiunta, modifica ed elimina.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/modalCovata.png"/>
  </div>
  <sup style="font-style: italic;">Modal di aggiunta/modifica covata<sup>
</div>

#### Rilascio #5

Il rilascio numero cinque, si è basato sul controllo della parentala tra padre, madre e viceversa.
Il controllo infatti, avviene ogni volta che viene modificato il valore nella selezione di riferimento.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/modalPadreMadre.png"/>
  </div>
  <sup style="font-style: italic;">Info Parentela<sup>
</div>

Nella sezione delle informazioni della covata, è stata implementata la possibilità di aggiungere i figli ad essa. Questo processo può avvenire in due modi differenti:

1.  **Creazione ex-novo del soggetto** - permette all'allevatore di inserire un nuovo soggetto direttamente dalla pagina della covata.
2.  **Scelta di un soggetto** - permette all'allevatore di scegliere un soggetto già presente nel sistema.

Una volta che il numero dei figli di una covata è uguale al numero di uova deposte, il pulsante che permette di aggiungere nuovi figli verrà disabilitato.

<div style="text-align: center;">
  <div>
    <img src="/docs/img/aggiuntaFigli.png"/>
  </div>
  <sup style="font-style: italic;">Pagina Info Covata<sup>
</div>
