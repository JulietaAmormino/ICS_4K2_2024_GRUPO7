using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ISW_TP6_MAIL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("SendEmail")]
        public async Task<IActionResult> SendEmail(EmailDTO emailDTO)
        {
            if (emailDTO.CreditCardNumber.Replace(" ", "") == "4111111111111111") return Ok(false);

            await _emailService.SendEmailAsync(emailDTO);

            return Ok(true);
        }
    }
}
