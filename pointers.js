var BPTR = function(that, name, address)
{
    return {
                that:       that,
                name:       name, 
                pointer:    address, 
                get:        function()      { return mem[this.pointer]; }, 
                set:        function(val)   { mem[this.pointer] = val; }, 
                sync:       function()      { 
                    that[this.name+"_"].set(that[this.name+"$"]);
                    that[this.name+"_"].pointer = eval("that."+this.name);
                    that[this.name+"$"] = that[this.name+"_"].get();
                }
           };
}

function defVar(that, ptrname, address) {
    var ptr_pos = ptrname.indexOf("$");
    var varname = ptrname;
    if (ptr_pos >= 0) {
        varname = ptrname.substr(0, ptr_pos);

        that[varname+"_"] = BPTR(that, varname, address);
        
        Object.defineProperty(that, ptrname, {
            get: function () { 
                return that[varname+"_"].get();
            },
            set: function (v) {
                that[varname+"_"].set(v);
            }
        });
        Object.defineProperty(that, varname, {
            get: function () { 
                return that[varname+"_"].pointer; 
            },
            set: function (v) {
                that[varname+"_"].pointer = v;
                that[varname+"_"].sync();
            }
        });
    }
    else {
        that[varname+"_"] = BPTR(that, varname, address);
        Object.defineProperty(that, varname, {
            get: function () { 
                return that[varname+"_"].get(); 
            },
            set: function (v) {
                that[varname+"_"].set(v);
            }
        });
        Object.defineProperty(that, "$"+varname, {
            get: function () { 
                return that[varname+"_"].pointer; 
            },
            set: function (v) {
                that[varname+"_"].pointer = v;
            }
        });
    }
}
