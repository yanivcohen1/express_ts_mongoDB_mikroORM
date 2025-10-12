import app from './app';
import { env } from './config/env';

function bootstrap(): void {
  const port = env.port;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

bootstrap();
