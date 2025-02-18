<!-- För eventuellt framtida mail funktion -->

<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $namn = htmlspecialchars($_POST["namn"]);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $meddelande = htmlspecialchars($_POST["meddelande"]);

    $errors = [];

    if (empty($namn)) {
        $errors[] = "Namn är obligatoriskt.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Ogiltig e-postadress.";
    }
    if (empty($meddelande)) {
        $errors[] = "Meddelande får inte vara tomt.";
    }

    if (!empty($errors)) {
        echo "<p style='color:red;'>" . implode("<br>", $errors) . "</p>";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Gmail SMTP-server
        $mail->SMTPAuth = true;
        $mail->Username = 'jonjohansson88@gmail.com'; // Din Gmail-adress
        $mail->Password = 'memx aglv wdnz ibbw'; // Gmail App-lösenord (inte ditt vanliga lösenord!)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Avsändare och mottagare
        $mail->setFrom($email, $namn);
        $mail->addAddress('dinmail@example.com'); // Din mottagaradress

        // Meddelande
        $mail->isHTML(true);
        $mail->Subject = "Nytt meddelande från kontaktformuläret";
        $mail->Body = "<strong>Namn:</strong> $namn <br><strong>E-post:</strong> $email <br><strong>Meddelande:</strong> $meddelande";

        $mail->send();
        echo "<p style='color:green;'>Meddelandet har skickats!</p>";
    } catch (Exception $e) {
        echo "<p style='color:red;'>Fel vid skickning: {$mail->ErrorInfo}</p>";
    }
}
?>
