// campos de estado y botón de inicio en la interfaz de usuario
var phraseDiv;
var resultDiv;
var createTranscriberButton, leaveButton, filePicker;
// Guardamos las claves de subscripcion y demas variables que usaremos
var subscriptionKey, serviceRegion;
var SpeechSDK;
var transcriber, conversation;
var audioFile;
document.addEventListener("DOMContentLoaded", 
  () => {
    createTranscriberButton = document.getElementById("createTranscriberButton");
    leaveButton = document.getElementById("leaveConversationButton");
    subscriptionKey = document.getElementById("subscriptionKey");
    serviceRegion = document.getElementById("serviceRegion");
    phraseDiv = document.getElementById("phraseDiv");
    resultDiv = document.getElementById("resultDiv");
    filePicker = document.getElementById("filePicker");
    var lastRecognized = ""
    filePicker.addEventListener("change",
      () => {
        audioFile = filePicker.files[0];
      });
    createTranscriberButton.addEventListener("click", 
      () => {
        phraseDiv.innerHTML = "";
        resultDiv.innerHTML = "";
        lastRecognized = "";
        if (!subscriptionKey.value || subscriptionKey.value === "subscription") {
            alert("No te olvides de colocar tu clave de subscripcion!");
            createTranscriberButton.disabled = false;
            return;
        }
        var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);
        var audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioFile);
        var randomId = Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        conversation = SpeechSDK.Conversation.createConversationAsync(speechConfig, randomId);
        window.console.log("conversation created, id: " + randomId);
        transcriber = new SpeechSDK.ConversationTranscriber(audioConfig);
        transcriber.joinConversationAsync(conversation, () => {
            var voiceSignatureUser1 = `{ 
              Version: 0,
                Tag: "<<VOICE_TAG_HERE>>",
                Data: "<<VOICE_DATA_HERE>>"
             }`;
            var voiceSignatureUser2 = `{ 
              Version: 0,
              Tag: "<<VOICE_TAG_HERE>>",
              Data: "<<VOICE_DATA_HERE>>"
             }`;
            // se crea participante 1

            var user1 = SpeechSDK.Participant.From("user1@example.com", "en-us", voiceSignatureUser1);

            // Creamos otro participante

            var user2 = SpeechSDK.Participant.From("user2@example.com", "en-us", voiceSignatureUser2);
            
            // Agregamos usuario 1 a la conversacion.
            conversation.addParticipantAsync(user1);
            // Agregamos usuario 2 a la conversacion
            conversation.addParticipantAsync(user2);
            transcriber.sessionStarted = function (s, e) {
                window.console.log(e);
            }
            transcriber.sessionStopped = function (s, e) {
                window.console.log(e);
                createTranscriberButton.disabled = false;
            }
            transcriber.canceled = function (s, e) {
                window.console.log(e);
            }
            transcriber.transcribing = function (s, e) {
                // window.console.log(e);
            };
            // El evento reconocido señala que se recibe un resultado de reconocimiento final.
            // Este es el evento final de que una frase ha sido reconocida.
            // Para la transcripción, obtendrá un evento reconocido por cada frase reconocida.
            
            transcriber.transcribed = function (s, e) {
                window.console.log(e);
                // Indica que no se reconocio la voz
                if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
                    var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);
                    resultDiv.innerHTML += "(transcribed)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason] + "\r\n";
                } else {
                    resultDiv.innerHTML += "(transcribed)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " Text: " + e.result.text + "\r\n";
                    resultDiv.innerHTML += "(transcribed)  SpeakerId: " + e.result.speakerId + "\r\n";
                }
                lastRecognized += e.result.text + "\r\n";
                phraseDiv.innerHTML = lastRecognized;
            };
            transcriber.startTranscribingAsync(
                () => {
                    window.console.log("startTranscribing complete");
                });
            createTranscriberButton.disabled = true;
            leaveButton.disabled = false;
        });
    });
    leaveButton.addEventListener("click", function () {
        transcriber.stopTranscribingAsync(
          () => {
            transcriber.leaveConversationAsync(
              () => {
                conversation.endConversationAsync(
                  () => {
                    transcriber.close();
                    conversation = undefined;
                    transcriber = undefined;
                    createTranscriberButton.disabled = false;
                    leaveButton.disabled = true;
                  });
              });
          });
    });
    if (!!window.SpeechSDK) {
        SpeechSDK = window.SpeechSDK;
        createTranscriberButton.disabled = false;
        leaveButton.disabled = true;
        document.getElementById('content').style.display = 'block';
        document.getElementById('warning').style.display = 'none';
    }
});