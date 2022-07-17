#include "board.h"
#include "search.h"
#include "shifting.h"

#include <emscripten/bind.h>
using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_module) {
	function("encode", &board::encode);
	function("print", &board::print);
	function("init", &board::init);
	function("getLegalShifts", &shifting::getLegalShifts);
	function("shift", &shifting::shift);
	register_vector<int>("IntVector");
}