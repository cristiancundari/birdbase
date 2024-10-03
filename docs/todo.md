(C) #GARE - Se non ci sono posti disponibili inibire l'iscrizione {cm:2024-09-20}
(C) #COVATE - Impostare il flag completato quando si aggiunge l'ultimo figlio {cm:2024-10-01}
(D) #PROMEMORIA - Sistemare badge di presenza evento nel calendario che risulta nella data successiva
(D) #PROMEMORIA - Impostare la priorità del promemoria a bassa di default
(C) #PROMEMORIA - Sincronizzare il calendario con google
(F) #PROMEMORIA - Impostare la data del promemoria che viene creato uguale alla data selezionata sul calendario
(D) #IMPOSTAZIONI - Rimuovere alexa e aggiungere google se necessario
(B) #MESSAGGI - Verificare corretto funzionamento badge di notifica (non visualizza il badge di nuove notifiche al caricamento della pagina)
(B) #MESSAGGI - Implementare la gestione dei canali
(A) #COVATE - Generare un errore quando si prova ad eliminare una covata con dei figli associati
(E) #GARE - Evitare l'iscrizione di più soggetti di quanti sono i posti disponibili
(C) #PROMEMORIA - Aspettare che si concluda l'operazione di inserimento nuovo promemoria utilizzando un loader sul pulsante

(A) Visualizzare foto dopo il caricamento nel modal di inserimento di una gara {cm:2023-11-14}
(A) Aggiustare API soggetto con transazione durante l'inserimento e l'upload + gestione errori {cm:2023-11-15}
(A) Assicurarsi che la validazione errorri dei form lato client sia conforme a quella del server
(B) Modificare il percorso dell'immagine con la variabile imgPath -> helper.ts in tutte le occorrenze {cm:2024-01-12}
(C) Verificare la necessità di utilizzare undefined quando si fa l'update delle immagini. Non basta vedere se il campo "immagine" o "avatar" è una stringa? {cm:2023-11-15}
(C) Modificare l'API di modifica del soggetto seguendo lo schema di quello della gara {cm:2023-11-15}
(D) Sistemare le immagini nel bucket di supabase in cartelle differenti (avatar e gare) {cm:2024-01-12}
(D) Sistemare il loading in caso di errore API {cm:2024-01-26}
(A) Rendere l'API utilizzabile solo da chi ne ha i permessi
(A) Generare un errore quando si prova ad eliminare una covata con dei figli associati
(C) Sistemare l'azione di OnDelete e OnUpdate sullo schema prisma
(F) Gestire i morti {cm:2024-01-12}
(F) Valutare la condivisione dello schema zod nei metodi POST e PATCH dell'API che risultano molto simili
(F) Verificare tutte le validazioni di dati lato client nei vari form dei modal (valutare se utilizzare zod "mantine-form-zod-resolver")
(C) Verificare durante la modifica del sesso di un soggetto se il soggetto è padre o madre di una covata e generare errore in caso affermativo
(E) Modificare layout combobox in ModalAggiungiFiglio in modo che sia visibile la data di nascita, la gabbia e il preferito
(C) Aggiungere popover a SoggettoComp in modo da poter visualizzare eventuali note {cm:2024-01-26}

(D) Mostrare nel report del portafoglio le opzioni che l'utente ha selezionato per generarlo
(D) Disattivare il submit di tutti i form quando si preme il tasto invio
(D) Valutare di aggiungere la funzionalità che permette di aggiungere multipli figli a una covata
(C) Proteggere l'accesso ai bucket di supabase (al momento pubblici)
(C) Verificare un dominio su Resend.com e modificare l'invio di email in modo da inviarle all'utente effettivo invece che a "delivered@resend.dev"
(C) Creare dei template HTML per le email

----- COMPRAVENDITA -----
Nella pagina dedicata "marketplace" l'allevatore può creare un inserzione selezionando uno dei propri soggetti che desidera vendere, scegliendo un prezzo e il metodo di spedizione.
Un secondo allevatore può consultare la stessa pagina del marketplace e visualizzare tutte le inserzioni attive, scegliere il soggetto da acquistare, acquistarlo, e pagare direttamente sulla piattaforma (stripe/paypal).
In caso di spedizione, un sistema automatico traccerà le spedizioni e qualora risultasse consegnata, verrà inviata una e-mail all'acquirente che entro 48 ore potrà confermare la ricezione dall'app. Una volta confermata verrà rilasciato il pagamento al venditore. In caso di problemi, il pagamento non verrà rilasciato e sarà cura dell'amministratore contattare entrambe le parti della transazione per decidere come gestire il caso. L'amministratore avrà a disposizione una pagina dedicata per visualizzare le varie controversie e agire nel modo secondo lui più congeniale, rilasciando il pagamento al venditore o annullando l'ordine.

Quando una transazione viene confermata, verranno create le relative voci di spesa e incasso nella sezione portafoglio di entrambi venditore e acquirente.
