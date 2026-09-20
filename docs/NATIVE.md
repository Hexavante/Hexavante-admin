# Apps nativos — APK (Ionic/Capacitor) e EXE (Tauri)

## App Ionic nativo (REST API)

O cliente Angular em `mobile/` consome `/api/v1/` diretamente (sem WebView do site).

```bash
npm run mobile:dev          # browser em localhost:4200
npm run mobile:build        # gera mobile/www
npm run mobile:android:sync # build + cap sync android
```

Ver `mobile/README.md` para detalhes de auth, tabs e OAuth.

## Diagnóstico rápido

```bash
npm run native:env
npm run native:check -- --desktop
npm run native:check -- --android
```

## Erro: `cargo metadata` / program not found

Rust está instalado mas o terminal **não vê o Cargo** no PATH.

1. Instale: https://rustup.rs/
2. **Feche e reabra** o terminal (ou reinicie o Cursor)
3. Os scripts `native:desktop*` já adicionam `%USERPROFILE%\.cargo\bin` automaticamente

## Erro: `linker link.exe not found`

Rust está OK, mas falta o **compilador C++ (MSVC)** — o arquivo `link.exe`.

### Build Tools instalado mas o check falha?

O instalador pode mostrar "Ferramentas de Build" **sem** o workload C++. São coisas diferentes:

1. Abra o **Visual Studio Installer** (como na sua tela)
2. Clique em **Modificar** no Build Tools 2026
3. Marque **"Desenvolvimento para desktop com C++"** (MSVC + Windows SDK)
4. Conclua a instalação e reinicie o terminal
5. Confirme: `npm run native:check -- --desktop`

### Ainda não instalou?

1. Baixe: [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Na instalação, marque **"Desenvolvimento para desktop com C++"**
3. Reinicie o terminal (ou o PC)
4. Confirme: `npm run native:check -- --desktop`

## Erro: `time_macros::timestamp` / could not compile `time`

Bug conhecido em `time` 0.3.50 + `time-macros` 0.2.29 (jun/2026). O `Cargo.lock` do projeto já fixa versões corrigidas (`time` 0.3.51+).

Se voltar a aparecer após `cargo update`:

```bash
cd src-tauri
cargo update -p time --precise 0.3.51
```

## Erro: Android Studio não abre

Não é obrigatório ter a IDE. Gere o APK pela linha de comando:

```bash
npm run native:android:apk
```

APK debug: `android/app/build/outputs/apk/debug/app-debug.apk`

### Erro: `non-ASCII characters` no caminho (Programação, etc.)

O Android Gradle Plugin bloqueia pastas com acentos no Windows. O projeto já inclui em `android/gradle.properties`:

```properties
android.overridePathCheck=true
```

Se o erro persistir, sincronize de novo no Android Studio (**Sync Project**) ou rode `npm run native:android:apk` outra vez.

### Erro: Play Protect / "não é seguro" / Chrome não deixa baixar

Isso é **normal** para APK fora da Google Play. O Chrome **bloqueia download** de APK na maioria dos celulares.

**Forma recomendada (USB):**

1. No celular: **Configurações → Sobre o telefone** → toque 7× em "Número da versão" → volte → **Opções do desenvolvedor** → ative **Depuração USB**
2. Conecte o cabo USB ao PC
3. No PC:

```powershell
npm run native:android:apk
npm run native:android:install
```

O `adb` instala direto, sem passar pelo navegador.

**Se instalar manualmente** (arquivo copiado para o celular):

1. Copie `app-release.apk` para a pasta **Download** via cabo USB (não baixe pelo Chrome)
2. Abra **Arquivos** → toque no APK
3. Se aparecer **Play Protect**: toque em **Mais detalhes** → **Instalar mesmo assim** (ou "Ignorar")
4. Permita **Instalar apps desconhecidos** para o app Arquivos, se pedido

**Para publicar sem aviso:** envie o app à Google Play (teste interno ou produção).

### Instalar Android SDK (se `native:check --android` falhar)

1. Instale [Android Studio](https://developer.android.com/studio)
2. Abra → **SDK Manager** → instale **Android SDK**
3. Rode `npm run native:env` e copie as variáveis sugeridas para `.env.local`:

```bash
ANDROID_HOME=C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
```

No PowerShell (sessão atual):

```powershell
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
$env:PATH="$env:ANDROID_HOME\platform-tools;$env:PATH"
```

## Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run native:desktop` | App Windows (Tauri) — requer `npm run dev` em outro terminal |
| `npm run native:desktop:build` | Gera `.exe` / `.msi` |
| `npm run native:android:apk` | APK **release** assinado → **hexavante.com.br** |
| `npm run native:android:apk:debug` | APK debug (só dev) |
| `npm run native:android:install` | Instala release via USB (`adb`) |
| `npm run native:android:open` | Abre projeto no Android Studio |
| `npm run native:android:sync` | Sincroniza Capacitor |

## URLs (.env.local)

```bash
# Desenvolvimento web no PC
NEXT_PUBLIC_APP_URL=http://localhost:3000
HEXAVANTE_APP_URL=http://localhost:3000

# APK em produção (padrão do npm run native:android:apk)
CAPACITOR_SERVER_URL=https://hexavante.com.br
```

| Comando | URL do app |
|---------|------------|
| `npm run native:android:apk` | **https://hexavante.com.br** (produção) |
| `npm run native:android:apk:phone` | IP da Wi‑Fi + `npm run dev:lan` (dev) |
| `npm run native:android:apk:emulator` | `http://10.0.2.2:3000` + `npm run dev` (dev) |

Produção: use HTTPS em todas.

## Testar no celular (APK)

O app Android é um WebView. **Por padrão o APK aponta para https://hexavante.com.br** — igual ao site publicado, sem precisar do `npm run dev` no PC.

### Instalar APK de produção

```bash
npm run native:android:apk
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

Com USB:

```bash
npm run native:android:install
```

### Dev local (opcional — testar mudanças antes do deploy)

**Terminal 1:**

```bash
npm run dev:lan
```

**Terminal 2:**

```bash
npm run native:android:apk:phone
```

## Saídas

- **EXE:** `src-tauri/target/release/bundle/`
- **APK debug:** `android/app/build/outputs/apk/debug/app-debug.apk`
