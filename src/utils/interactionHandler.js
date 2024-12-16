const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

async function handleInteractionWithRetry(interaction, handler) {
    let attempts = 0;

    while (attempts <= MAX_RETRIES) {
        try {
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply().catch(error => {
                    console.error('Failed to defer reply:', error);
                    throw error;
                });
            }

            await handler();
            return; // Success, exit the retry loop

        } catch (error) {
            attempts++;
            console.error(`Interaction attempt ${attempts} failed:`, {
                command: interaction.commandName,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            });

            if (attempts <= MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            } else {
                // All retries failed, send error message to user
                const errorMessage = {
                    content: 'Sorry, there was an error executing this command. Please try again.',
                    ephemeral: true
                };

                try {
                    if (interaction.replied) {
                        await interaction.followUp(errorMessage);
                    } else {
                        await interaction.editReply(errorMessage);
                    }
                } catch (replyError) {
                    console.error('Failed to send error message:', replyError);
                }

                throw error; // Propagate the error for logging
            }
        }
    }
}

module.exports = { handleInteractionWithRetry };