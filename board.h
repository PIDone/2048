#ifndef BOARD_H
#define BOARD_H

#include <string>

namespace board {
	struct Tile {
		int exponent;
		bool moved;
	};

	extern Tile board[4][4];
	extern int score;

	void decode(std::string text);
	std::string encode();
	
	void print();

	void newTile();
	bool gameOver();



	void init();
}

#endif
