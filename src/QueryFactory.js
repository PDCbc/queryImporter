/**
 * Created by sdiemert on 15-08-19.
 */

var Factory   = require("./Factory").Factory;
var Query     = require("./model/Query").Query;
var fs        = require("fs");
var constants = require("./constants");

function QueryFactory(proc) {

    proc = proc || {};

    //inherits from Factory object.
    var that = Factory(proc);

    /**
     * Creates a new Query object from the data in a directive object.
     *
     * @param dir {Object} the directive object for the query.
     * @param user {User} the user object to associate with this query.
     * @param conn {Object} Mongoose connection object that contains the models we need.
     *
     * @return {Query} a query object
     */
    var create = function (dir, user, conn) {

        if (!proc.verifyInput(dir)) {
            return null;
        }

        var q = new Query(conn);

        q.setUser(user);

        q.setTitle(dir.title);
        q.setDisplayName(dir.display_name);
        q.setDescription(dir.description);
        q.setType(dir.query_type);

        var code = proc.fetchCode(dir.map);

        if (!code) {

            console.log("Failed to get query from: " + dir.map);
            return null;

        } else {

            q.setMap(code);

        }

        //TODO: Put call to fetchCode(path) for the reduce function as well.
        //q.setReduce(dir.reduce);

        //the remainder of these fields are optional, so we need to check that they are
        //non-null before we try to use them.

        try {

            if (dir.unit) {
                q.setUnit(dir.unit);
            }

            if (dir.target && dir.target.value) {
                q.setTarget(dir.target.value, dir.target.reference, dir.target.description);
            }

            if (dir.panels && dir.panels.length > 0) {
                q.setPanels(dir.panels);
            }

        } catch (e) {

            console.log("failed to create a non-critical field in query object, error was: " + e);

        }

        // if we get here, then we have a populated Query object.
        // we now return it.

        return q;

    };


    /**
     * Checks that the query's input is valid.
     *
     * @param dir {Object} a directive object for the query to make.
     *
     * @return {Boolean} true if the directive passes verification, false otherwise.
     */
    var verifyInput = function (dir) {

        if (!dir) {

            return false;

        } else if (!dir.type) {

            return false;

        } else if (!dir.title) {

            return false;

        } else if (!dir.display_name) {

            return false;

        } else if (!dir.description) {

            return false;

        } else if (!dir.query_type) {

            return false;

        } else if (!dir.map) {

            return false;

        } else if (!dir.reduce) {

            return false;

        } else {

            return true;

        }

    };

    proc.verifyInput = verifyInput;

    that.create = create;

    return that;
}

module.exports = {QueryFactory: QueryFactory};
