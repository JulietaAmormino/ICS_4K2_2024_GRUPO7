using Microsoft.AspNetCore.Identity.UI.Services;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace ISW_TP6_MAIL
{
    public class EmailService : IEmailSender, IEmailService
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;

        public EmailService() { }

        public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
        {
            this._logger = logger;
            this._configuration = configuration;
        }
        
        public async Task<string> SendEmailAsync(EmailDTO emailDTO)
        {
            string sendGridApiKey = _configuration["SendGrid:ApiKey"];
            string emailAddress = "solucionado.mailing.service@gmail.com";
            string appName = "ISW - Grupo7 - 4K2";
            var client = new SendGridClient(sendGridApiKey);
            string orderNumber = GenerateOrderNumber();
            SendGridMessage msg = await BuildMessage(emailDTO, $"Cotización confirmada - Pedido {orderNumber}", emailAddress, appName);

            var response = await client.SendEmailAsync(msg);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email queued successfully");
                return orderNumber;
            }
            else
            {
                _logger.LogError("Failed to send email");
            }
            return "";
        }

        public static string GenerateOrderNumber()
        {
            const string prefix = "#ORD";
            int randomNumber = new Random().Next(1000000);
            string paddedNumber = randomNumber.ToString("D7"); 
            return $"{prefix}-{paddedNumber}";
        }

        private async Task<SendGridMessage> BuildMessage(EmailDTO emailDTO, string subject, string emailAddress, string appName)
        {
            // Leer el contenido del archivo
            string htmlContent = File.ReadAllText("email.html");
            htmlContent = htmlContent.Replace("[DadorCarga]", emailDTO.DadorCarga);
            htmlContent = htmlContent.Replace("[Calificacion]", emailDTO.Calificacion);
            htmlContent = htmlContent.Replace("[Transportista]", emailDTO.Transportista);
            htmlContent = htmlContent.Replace("[FechaRetiro]", emailDTO.FechaRetiro);
            htmlContent = htmlContent.Replace("[FechaEntrega]", emailDTO.FechaEntrega);
            htmlContent = htmlContent.Replace("[FormaPago]", emailDTO.FormaPago);
            htmlContent = htmlContent.Replace("[Importe]", emailDTO.Importe);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(emailAddress, appName),
                Subject = subject,
                PlainTextContent = htmlContent,
                HtmlContent = htmlContent
            };
            msg.AddTo(new EmailAddress(emailDTO.Email));
            return msg;
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            throw new NotImplementedException();
        }
    }
}
