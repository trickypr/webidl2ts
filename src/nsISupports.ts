/**
 * This is the root component for everything in xpcom / Gecko. To save on time, I am going to
 * add it to every file
 */
export const nsISupportsString = `

/**
	* ID object
*/
typedef object nsIIDRef;

typedef object nsQIResult;

typedef number MozExternalRefCountType;


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * The mother of all xpcom interfaces.
 */


/**
 * Basic component object model interface. Objects which implement
 * this interface support runtime interface discovery (QueryInterface)
 * and a reference counted memory model (AddRef/Release). This is
 * modelled after the win32 IUnknown API.
 *
 * Historically, nsISupports needed to be binary compatible with COM's
 * IUnknown, so the IID of nsISupports is the same as it. That is no
 * longer a goal, and hopefully nobody depends on it. We may break
 * this compatibility at any time.
 */
[scriptable]
interface nsISupports {

  /**
   * A run time mechanism for interface discovery.
   * @param aIID [in] A requested interface IID
   * @param aInstancePtr [out] A pointer to an interface pointer to
   * receive the result.
   * @return <b>NS_OK</b> if the interface is supported by the associated
   * instance, <b>NS_NOINTERFACE</b> if it is not.
   *
   * aInstancePtr must not be null.
   */
  void QueryInterface(nsIIDRef aIID,
                      [retval] nsQIResult aInstancePtr);

  /**
   * Increases the reference count for this interface.
   * The associated instance will not be deleted unless
   * the reference count is returned to zero.
   *
   * @return The resulting reference count.
   */
  [noscript, notxpcom] MozExternalRefCountType AddRef();

  /**
   * Decreases the reference count for this interface.
   * Generally, if the reference count returns to zero,
   * the associated instance is deleted.
   *
   * @return The resulting reference count.
   */
  [noscript, notxpcom] MozExternalRefCountType Release();
};`
