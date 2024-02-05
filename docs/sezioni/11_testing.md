Durante la fase di testing nell'ambito dello sviluppo della nostra web-app utilizzando la metodologia agile con un approccio di pair-programming, ci siamo concentrati sull'assicurarci che ogni componente e funzionalità del sistema fossero robusti e conformi alle specifiche richieste.
L'approccio iterativo e incrementale della metodologia agile ci ha permesso di verificare il codice attraverso test automatizzati per garantire la coerenza nel tempo e per facilitare la verifica continua delle nuove funzionalità integrate.

Per la creazioni dei suddetti test automatizzati abbiamo utilizzato le seguenti librerie:

- **Vitest** - framework che facilita e organizza il processo di testing del software, aiutando gli sviluppatori a scrivere, eseguire e analizzare i test in modo efficiente
- **React Testing Library** - libreria utile a testare qualsiasi tipo di componente React
- **Jest-Dom** - lavora in tandem con _React Testing Library_, ed è utilizzato per simulare la DOM di un browser per renderizzare i componenti da testare
- **Mock Service Worker** - libreria di simulazione API che consente di scrivere mocks indipendenti dal client e riutilizzarle su qualsiasi framework

### Test effettuati:

I seguenti test sono stati suddivisi per componente e/o funzionalità:

1. Componente Soggetto
   - dovrebbe visualizzare l'icona del sesso maschio
   - dovrebbe visualizzare l'icona del sesso femmina
   - dovrebbe visualizzare l'icona del sesso in attesa
   - dovrebbe mostrare l'icona morto se il soggetto è morto e nascondere l'icona della gabbia (se valorizzata)
   - dovrebbe mostrare l'icona della gabbia (se valorizzata) se è vivo
   - dovrebbe nascondere l'icona della gabbia (se non valorizzata) se è vivo
   - dovrebbe mostrare l'icona della nota se valorizzata
   - dovrebbe mostrare la nota se valorizzata quando si passa col mouse sull'icona
   - dovrebbe nascondere l'icona della nota se stringa vuota
   - dovrebbe mostrare l'icona attiva del preferito se il soggetto è impostato come preferito
   - dovrebbe mostrare l'icona non attiva del preferito se il soggetto non è impostato come preferito
   - dovrebbe mostrare l'identificativo dell'anelletto come RNA-Anno-Numero
   - dovrebbe mostrare l'immagine del soggetto se ne esiste una
   - dovrebbe mostrare un placeholder come immagine del soggetto se non ne esiste una
2. Operazioni CRUD Soggetto
   - dovrebbe renderizzare la home page mostrando tutti i soggetti
   - dovrebbe mostrare il componente 'nessun soggetto' se l'API non restituisce nessun elemento
   - dovrebbe aprire il modal quando viene premuto il pulsante aggiungi
   - dovrebbe effettuare un inserimeto se cliccato il pulsante salva
   - dovrebbe effettuare la cancellazione del soggetto se cliccato il pulsante elimina del modal
   - dovrebbe mostrare il modal in modalità di modifica e modificare il soggetto
   - dovrebbe impostare il soggetto come preferito se si clicca la relativa icona
3. Poprtafoglio - Budget
   - dovrebbe visualizzare il budget dell'utente
   - dovrebbe visualizzare il bilancio (budget - spese del mese in corso)
   - dovrebbe visualizzare un input per modificare il budget quando si attiva la modalità di modifica
   - dovrebbe salvare una modifica al budget
4. Portafoglio - Transazioni
   - dovrebbe visualizzare la lista delle transazioni
   - dovrebbe visualizzare il modal di aggiunta transazione quando si fa click sul pulsante aggiungi
   - dovrebbe salvare una nuova transazione
   - dovrebbe visualizzare il modal di modifica con i relativi dati già inseriti ed effettuare il salvataggio
   - dovrebbe visualizzare il modal di cancellazione se cliccato il pulsante elimina ed eliminare la transazione
5. Portafoglio - Grafici
   - dovrebbe ottenere i dati delle spese e mostrarli nel grafico
   - dovrebbe mostrare la pagina vuota quando non ci sono spese
   - dovrebbe mostrare la pagina vuota quando non ci sono incassi
   - dovrebbe mostrare la notifica di errore se l'API fallisce
6. Componente Covata
   - dovrebbe visualizzare la gabbia se è presente
   - dovrebbe nascondere la gabbia se non è presente
   - dovrebbe visualizzare l'icona covata completata se settata
   - dovrebbe nascondere l'icona covata completata se settata
7. Operazioni CRUD Covate
   - dovrebbe ottenere tutte le covate
   - dovrebbe aprire il modal cliccando il bottone aggiungi e salvare la covata cliccando il bottone salva
   - dovrebbe aprire il modal in modalità di modifica se cliccato il bottone MODIFICA ed effettuare il salvataggio se cliccato su salva
   - dovrebbe eliminare la covata se cliccato il pulsante elimina
8. Componente InfoGabbia
   - dovrebbe visualizzare il "-" se non è presente il numero della gabbia
   - dovrebbe visualizzare il numero di gabbia con l'icona
   - dovrebbe nascondere il numero di gabbia se è null

<div style="text-align: center;">
  <div>
    <img src="/docs/img/test.png"/>
  </div>
  <sup style="font-style: italic;">Coverage dei test<sup>
</div>
