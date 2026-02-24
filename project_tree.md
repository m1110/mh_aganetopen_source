.
├── LICENSE
├── README.md
├── app
│   ├── actions.ts
│   ├── api
│   │   ├── auth
│   │   │   └── [...nextauth]
│   │   │       └── route.ts
│   │   ├── chat
│   │   │   ├── context
│   │   │   │   └── pinecone.ts
│   │   │   ├── edges
│   │   │   │   ├── graphDecisioning.ts
│   │   │   │   └── selectQueryAction.ts
│   │   │   ├── graph.js
│   │   │   ├── nodes
│   │   │   │   ├── bundleQueries.ts
│   │   │   │   ├── bundleQueriesChain.js
│   │   │   │   ├── conversationLocator.ts
│   │   │   │   ├── conversationLocatorChain.js
│   │   │   │   ├── doctorBennett.ts
│   │   │   │   ├── doctorBennettChain.js
│   │   │   │   ├── generalIntelligence.ts
│   │   │   │   ├── generalIntelligenceChain.js
│   │   │   │   ├── patientCounselor.ts
│   │   │   │   ├── patientCounselorChain.js
│   │   │   │   ├── submitQueries.ts
│   │   │   │   └── submitQueriesChain.js
│   │   │   ├── prompts
│   │   │   │   ├── askNeededQuestions.ts
│   │   │   │   ├── collectParamSystemMsg.ts
│   │   │   │   ├── extractValues.ts
│   │   │   │   ├── functionCallResult.ts
│   │   │   │   └── systemMsg.ts
│   │   │   ├── route.ts
│   │   │   ├── utils
│   │   │   │   └── helper.ts
│   │   │   ├── utils.js
│   │   │   └── workflow.js
│   │   └── vector
│   │       └── route.ts
│   ├── chat
│   │   └── [id]
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── opengraph-image.png
│   ├── page.tsx
│   ├── share
│   │   └── [id]
│   │       ├── opengraph-image.tsx
│   │       └── page.tsx
│   ├── sign-in
│   │   └── page.tsx
│   ├── twitter-image.png
│   └── updates
│       └── page.tsx
├── assets
│   ├── fonts
│   │   ├── Inter-Bold.woff
│   │   └── Inter-Regular.woff
│   └── rowhome.svg
├── auth.ts
├── components
│   ├── button-scroll-to-bottom.tsx
│   ├── chat-list.tsx
│   ├── chat-message-actions.tsx
│   ├── chat-message.tsx
│   ├── chat-panel.tsx
│   ├── chat-scroll-anchor.tsx
│   ├── chat.tsx
│   ├── clear-history.tsx
│   ├── decider.tsx
│   ├── empty-screen.tsx
│   ├── external-link.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── login-button.tsx
│   ├── markdown.tsx
│   ├── metadata.tsx
│   ├── prompt-form.tsx
│   ├── providers.tsx
│   ├── rowhomeSVG.tsx
│   ├── sidebar-actions.tsx
│   ├── sidebar-footer.tsx
│   ├── sidebar-item.tsx
│   ├── sidebar-list.tsx
│   ├── sidebar.tsx
│   ├── tailwind-indicator.tsx
│   ├── theme-toggle.tsx
│   ├── toaster.tsx
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── codeblock.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── icons.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   └── user-menu.tsx
├── context
│   ├── ChatContext.js
│   └── DataContext.js
├── langfuse.md
├── lib
│   ├── analytics.ts
│   ├── deepgramTTS.ts
│   ├── fonts.ts
│   ├── hooks
│   │   ├── use-at-bottom.tsx
│   │   ├── use-copy-to-clipboard.tsx
│   │   ├── use-enter-submit.tsx
│   │   └── use-local-storage.ts
│   ├── tts.ts
│   ├── types.ts
│   └── utils.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── authed.tsx
│   ├── callback.tsx
│   └── up.tsx
├── pnpm-lock.yaml
├── postcss.config.js
├── prettier.config.cjs
├── public
│   ├── Bessel-van-der-Kolk-MD-The-Body-Keeps-the-Score_Brain-Mind-and-Body-in-the-Healing-of-Trauma-Penguin.pdf
│   ├── Jay-Earley-Negotiating-for-Self-Leadership-in-Internal-Family-Systems-Therapy-Pattern-System-Books.pdf
│   ├── Joanne-Twombly-Trauma-and-Dissociation-Informed-Internal-Family-Systems_How-to-Successfully-Treat-C-PTSD-and-Dissociative-Disorders.pdf
│   ├── Natalie-Y-Gutiérrez-LMFT-The-Pain-We-Carry_Healing-from-Complex-PTSD-for-People-of-Color-New-Harbinger-Publications.pdf
│   ├── Paul-Frewen-Ruth-Lanius-Bessel-van-der-Kolk-MD-David-Spiegel_Healing-the-Traumatized-Self-Consciousness-Neuroscience-Treatment.pdf
│   ├── Resmaa-Menakem-My-Grandmothers-Hands-Central-Recovery-Press-LLC.pdf
│   ├── Richard C. Schwartz_ Martha Sweezy - Internal Family Systems Therapy-The Guilford Press (2020) (1).pdf
│   ├── Richard-Schwartz-No-bad-parts_healing-trauma-and-restoring-wholeness-with-the internal-family-systems-model.pdf
│   ├── Introspect IFS in Black S1 E4.pdf
│   ├── Introspect Project IFS in Black S1 E1.pdf
│   ├── Introspect Project IFS in Black S1 E2.pdf
│   ├── Introspect Project IFS in Black S1 E3.pdf
│   ├── Introspect Project IFS in Black S1 E5.pdf
│   ├── Introspect Project IFS in Black S1 E6.pdf
│   ├── Introspect Project IFS in Black S1 E7.pdf
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon.ico
│   ├── next.svg
│   ├── pdfs
│   │   ├── Bessel-van-der-Kolk-MD-The-Body-Keeps-the-Score_Brain-Mind-and-Body-in-the-Healing-of-Trauma-Penguin.pdf
│   │   ├── Jay-Earley-Negotiating-for-Self-Leadership-in-Internal-Family-Systems-Therapy-Pattern-System-Books.pdf
│   │   ├── Joanne-Twombly-Trauma-and-Dissociation-Informed-Internal-Family-Systems_How-to-Successfully-Treat-C-PTSD-and-Dissociative-Disorders.pdf
│   │   ├── Natalie-Y-Gutiérrez-LMFT-The-Pain-We-Carry_Healing-from-Complex-PTSD-for-People-of-Color-New-Harbinger-Publications.pdf
│   │   ├── Paul-Frewen-Ruth-Lanius-Bessel-van-der-Kolk-MD-David-Spiegel_Healing-the-Traumatized-Self-Consciousness-Neuroscience-Treatment.pdf
│   │   ├── Resmaa-Menakem-My-Grandmothers-Hands-Central-Recovery-Press-LLC.pdf
│   │   ├── Richard C. Schwartz_ Martha Sweezy - Internal Family Systems Therapy-The Guilford Press (2020) (1).pdf
│   │   ├── Richard-Schwartz-No-bad-parts_healing-trauma-and-restoring-wholeness-with-the internal-family-systems-model.pdf
│   │   ├── Introspect IFS in Black S1 E4.pdf
│   │   ├── Introspect Project IFS in Black S1 E1.pdf
│   │   ├── Introspect Project IFS in Black S1 E2.pdf
│   │   ├── Introspect Project IFS in Black S1 E3.pdf
│   │   ├── Introspect Project IFS in Black S1 E5.pdf
│   │   ├── Introspect Project IFS in Black S1 E6.pdf
│   │   └── Introspect Project IFS in Black S1 E7.pdf
│   ├── thirteen.svg
│   └── vercel.svg
├── stores
│   └── chat.ts
├── tailwind.config.js
├── tools
│   ├── messageInput.js
│   ├── publicNav
│   │   └── index.js
│   └── textarea.js
└── tsconfig.json