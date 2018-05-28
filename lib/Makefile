# BINARIES
EMCC = emcc

# FLAGS
EMCC_FLAGS = -O3 --memory-init-file 0 -s RESERVED_FUNCTION_POINTERS=1 -s WASM=0
SQLITE_FLAGS = -DSQLITE_THREADSAFE=0 -DSQLITE_DEFAULT_MEMSTATUS=0 -DSQLITE_OMIT_LOAD_EXTENSION -DSQLITE_OMIT_DEPRECATED
RUNTIME_METHODS = -s "EXTRA_EXPORTED_RUNTIME_METHODS=['addFunction', 'cwrap', 'FS', 'getValue', 'UTF8ToString']"
EXPORTED_FUNCTIONS = -s "EXPORTED_FUNCTIONS=['_sqlite3_open', '_sqlite3_exec', '_sqlite3_close']"

# SOURCES
SQLITE_URL = https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release

# TARGETS
sqlite.js: sqlite.c
	$(EMCC) $(EMCC_FLAGS) $(SQLITE_FLAGS) $(RUNTIME_METHODS) $(EXPORTED_FUNCTIONS) $< -o $@

sqlite.c: sqlite.tar.gz
	tar -zxvf $<
	cd sqlite && sh configure
	cd sqlite && make sqlite3.c
	cp sqlite/sqlite3.c $@

sqlite.tar.gz:
	wget $(SQLITE_URL) -O $@

.PHONY: clean
clean:
	rm -rf sqlite.c sqlite.tar.gz sqlite/
