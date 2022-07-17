#ifndef SEARCH_H
#define SEARCH_H

#include <string>

namespace search {
	int evaluate();
	int max(int depth, bool first);
	int search(int timeMS);
}

#endif
