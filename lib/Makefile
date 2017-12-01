# BINARIES
EMCC=emcc

# FLAGS
CFLAGS=-DSQLITE_THREADSAFE=0 -DSQLITE_OMIT_LOAD_EXTENSION -O3 --memory-init-file 0
RUNTIME_METHODS=-s "EXTRA_EXPORTED_RUNTIME_METHODS=['FS']"
RESERVED_POINTERS=-s "RESERVED_FUNCTION_POINTERS=1"
EXPORTED_FUNCTIONS=-s "EXPORTED_FUNCTIONS=['_sqlite3_open', '_sqlite3_exec', '_sqlite3_close']"

# SOURCES
SQLITE_URL=https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release

# TARGETS
sqlite.js: sqlite.c
	$(EMCC) $(CFLAGS) $(RUNTIME_METHODS) $(RESERVED_POINTERS) $(EXPORTED_FUNCTIONS) $< -o $@

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
