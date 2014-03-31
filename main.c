#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "SDL2/SDL.h"

#include "Custom/Debug.h"
#include "Custom/GameFonts.h"
#include "Custom/Util.h"

SDL_Rect bullet[10];
Uint32 Timer_CreateBullet(Uint32 interval, void *param)
{
        SDL_Rect *ship = (SDL_Rect*)param;
        bullet[0].h = 6;
        bullet[0].w = 6;
        bullet[0].x = (ship->x + (ship->w / 2)) - (bullet[0].w / 2);
        bullet[0].y = ship->y;

        return interval;
}

int main(int argc, char *argv[])
{
        SDL_bool quit = SDL_FALSE;
        SDL_Event e;
        SDL_Window *window;
        SDL_Renderer *renderer;
        SDL_Texture *texture;
        SDL_Surface *surface;
        SDL_Rect ship;

        const float FPS = 60;
        const float MS_PER_UPDATE = 1000 / FPS;
        float lag = 0;
        float current = 0;
        float ellapsed = 0;
        float previous = 0;

        float ship_acceleration = .4;
        float ship_velocity = 2;
        float ship_x = 0;
        float ship_y = 0;
        int mX = 0;
        int mY = 0;

        ship.x = 0;
        ship.y = 0;
        ship.h = 20;
        ship.w = 18;

        if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
                DEBUG_ERR(SDL_GetError());
                return -1;
        }

        window = SDL_CreateWindow("Spaders",
                                  SDL_WINDOWPOS_CENTERED,
                                  SDL_WINDOWPOS_CENTERED,
                                  300,
                                  600,
                                  SDL_WINDOW_OPENGL);
        if (window == NULL) {
                DEBUG_ERR(SDL_GetError());
                return -1;
        }

        renderer = SDL_CreateRenderer(window,
                                      -1,
                                      SDL_RENDERER_ACCELERATED);

        if (renderer == NULL) {
                DEBUG_ERR(SDL_GetError());
                return -1;
        }

        surface = SDL_GetWindowSurface(window);

        if (surface == NULL) {
                DEBUG_ERR(SDL_GetError());
                return -1;
        }

        texture = SDL_CreateTextureFromSurface(renderer, surface);

        if (texture == NULL) {
                DEBUG_ERR(SDL_GetError());
                return -1;
        }

        SDL_AddTimer(500, Timer_CreateBullet, (void*)&ship);
        previous = SDL_GetTicks();
        while (!quit)
        {
                current = SDL_GetTicks();
                ellapsed = current - previous;
                previous = current;
                lag += ellapsed;

                SDL_PollEvent(&e);
                if (e.type == SDL_QUIT)
                        quit = SDL_TRUE;

                SDL_GetMouseState(&mX, &mY);
                if (e.type == SDL_KEYDOWN)
                {
                }

                while (lag >= MS_PER_UPDATE) {
                        DEBUG_LOG("m-%d %d\n", mX, mY);
                        DEBUG_LOG("s-%2.2f,%2.2f\n",ship_x, ship_y);

                        ship.x = Util_Lerp(ship_x, mX -
                                           ((ship.w  - (ship.w * 0.2))/ 2), 0.2);
                        ship.y = Util_Lerp(ship_y, mY, 0.2);

                        ship_x = ship.x;
                        ship_y = ship.y;

                        lag -= MS_PER_UPDATE;
                }

                SDL_RenderClear(renderer);
                SDL_FillRect(surface, NULL,
                             SDL_MapRGBA(surface->format,
                                         0xFF, 0xFF, 0xFF, 0xFF));
                SDL_FillRect(surface, &ship,
                             SDL_MapRGBA(surface->format,
                                         0xFF, 0x0, 0x0, 0xFF));

                SDL_FillRect(surface, &(bullet[0]),
                             SDL_MapRGBA(surface->format,
                                         0xFF, 0, 0xFF, 0xFF));

                SDL_UpdateTexture(texture, NULL, surface->pixels, surface->pitch);
                SDL_RenderCopy(renderer, texture, NULL, NULL);
                SDL_RenderPresent(renderer);
        }

        SDL_DestroyTexture(texture);
        SDL_FreeSurface(surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);

        SDL_Quit();

        return 0;
}
