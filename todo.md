(A) Visualizzare foto dopo il caricamento nel modal di inserimento di una gara {cm:2023-11-14}
(A) Aggiustare API soggetto con transazione durante l'inserimento e l'upload + gestione errori {cm:2023-11-15}
(A) Assicurarsi che la validazione errorri dei form lato client sia conforme a quella del server
(B) Modificare il percorso dell'immagine con la variabile imgPath -> helper.ts in tutte le occorrenze {cm:2024-01-12}
(C) Verificare la necessità di utilizzare undefined quando si fa l'update delle immagini. Non basta vedere se il campo "immagine" o "avatar" è una stringa? {cm:2023-11-15}
(C) Modificare l'API di modifica del soggetto seguendo lo schema di quello della gara {cm:2023-11-15}
(D) Sistemare le immagini nel bucket di supabase in cartelle differenti (avatar e gare) {cm:2024-01-12}
(D) Sistemare il loading in caso di errore API
(A) Rendere l'API utilizzabile solo da chi ne ha i permessi
(C) Sistemare l'azione di OnDelete e OnUpdate sullo schema prisma
(F) Gestire i morti {cm:2024-01-12}
(F) Valutare la condivisione dello schema zod nei metodi POST e PATCH dell'API che risultano molto simili
(F) Verificare tutte le validazioni di dati lato client nei vari form dei modal (valutare se utilizzare zod "mantine-form-zod-resolver")
(C) Verificare durante la modifica del sesso di un soggetto se il soggetto è padre o madre di una covata e generare errore in caso affermativo
(F) Modificare layout combobox in ModalAggiungiFiglio in modo che sia visibile la data di nascita, la gabbia e il preferito
(C) Aggiungere popover a SoggettoComp in modo da poter visualizzare eventuali note
