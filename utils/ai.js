
const what_is_orbis = `We are Orbis, an open social protocol that can be used by any developers to add social features to their existing application or create full open-social applications in a few lines of code and without having to setup any back-end. Developers can use the Orbis SDK to build those social features, here is the documentation of the Orbis SDK:
`;
const installation_code = `- Install the Orbis SDK
The Orbis SDK is a simple JavaScript package that can be installed using npm: npm install @orbisclub/orbis-sdk`;
const getting_started_code = `- Getting Started with the SDK
Once installed, you can import the SDK and initialize the orbis object which will give you access to all of the SDK’s features:

/** Import Orbis SDK */
import { Orbis } from "@orbisclub/orbis-sdk";

/** Initialize the Orbis class object */
let orbis = new Orbis();`;
const is_connected_code = `- orbis.isConnected()
  Will check if there is an active session stored in localStorage. If there is one it will automatically connect to Ceramic with it and allow users to write content without having to re-connect manually.

  How to use?
  let res = await orbis.isConnected();
  Returns
  The orbis.isConnected() function also returns the details of the user currently connected.

  {
    status: 200,
    did: "did:pkh:..",
    details: {
      did: "did:pkh:..",
      profile: {
        pfp: "https://...",
        username: "Baptiste",
        description: "..."
      }
    },
    result: "Success connecting to the DiD."
  }`;
const connect_v2_code = `- orbis.connect_v2()
  The connect_v2 function supports multi-chain (EVM & Solana) login. It also makes it easier to scale to additional blockchains and parameters in the future.

  How to use?
  let res = await orbis.connect_v2(options);
  Parameters:
  - options: A JSON object that contains the parameters to use to connect the end-user
  - provider: By default it will be using window.ethereum if available. Can be used to pass any provider.
  - chain: Must be ethereum or solana.
  - lit: Must be true or false. Using true will generate an additional signature for the end user to allow the usage of encrypted features (token gated posts or direct messages).

  Examples:
  Example to login with Metamask without requiring Lit

  let res = await orbis.connect_v2({
    provider: window.ethereum,
    lit: false
  });
  Example to login with WalletConnect

  /** Import the WalletConnect library */
  import { EthereumProvider } from "@walletconnect/ethereum-provider";

  /** Initiate the WC provider */
  const wc_provider = await EthereumProvider.init({
    projectId: <PROJECT_ID>,
    chains: ["1"]
  });

  /** Enable session (triggers QR Code modal) */
  await wc_provider.enable();

  /** Connect to Orbis using WalletConnect as a provider */
  let res = await orbis.connect_v2({
    provider: wc_provider
  });
  Example to login with Phantom and Solana

  let res = await orbis.connect_v2({
    provider: window.phantom?.solana,
    chain: "solana",
    lit: true
  });
  Returns:
  {
    status: 200,
    did: "did:pkh:..",
    details: {
      did: "did:pkh:..",
      profile: {
        pfp: "https://...",
        username: "Baptiste",
        description: "..."
      }
    },
    result: "Success connecting to the DiD."
  }`;
const create_post_code = `- orbis. createPost() to create or share post on Orbis:
  Used to share a new post on Orbis. Can be used to share posts in a specific context or in the global feed. If you are sharing an encrypted post you will need to use the orbis.decryptPost() function to decrypt the content.

  How to use?
  The createPost() function accepts a JSON object that must contain a body element which is the actual content of the post being shared.

  let res = await orbis.createPost({body: "gm!"});

  Parameters:
  content: A JSON object that contains the details of the post being shared
    body: string - required - (child of content) Content of the post being shared
    title: string (child of content) optional Title of the post (can be used for articles)
    context: string (child of content) optional Context in which the post is being shared. Can be a random string or a group / channel id
    master: string (child of content) optional If the post is being shared as a comment of a post
    reply_to: string (child of content) optional If the post shared is a reply to another comment in a thread
    mentions: array (child of content) optional Array of mentions if this post is mentioning other users, the array items must contain:
      did: string - (child of mentions) Did of the user being mentioned
      username: string - (child of mentions) Current username of the user
    tags: array - (child of content) optional Array of tags that can be used to filter posts in queries:
      slug: string - (child of tags) Identifier for the tag (used in queries)
      title: string - (child of tags) Title that can displayed in the app for example
    media: array - (child of content) optional An array of media object stored on IPFS
      url: string - (child of media) URL of the image must start with ipfs://
      gateway: string - (child of media) URL of the IPFS gateway where the media is stored
    data: object - (child of content) optional Can be used to attach some custom data to a post
    encryptionRules: object (child of content) optional A JSON object containing the optional encryption rules for this post.
      type: string (child of encryptionRules) The type of encryption needed, can be "token-gated"
      chain: string (child of encryptionRules if type is "token-gated") The chain on which the smart contract is. Must be one of those in lowercase
      contractType: string (child of encryptionRules if type is "token-gated") The type of contract being used, must be ERC20, ERC721 or ERC1155.
      contractAddress: string (child of encryptionRules if type is "token-gated") The address of the contract.
      minTokenBalance: string (child of encryptionRules if type is "token-gated") The minimum balance required to decrypt the post (in WEI for ERC20).
      tokenId: string optional (child of encryptionRules if type is "token-gated") Used only for ERC1155 tokens to represent the tokenId used.
`;
const react_code = `- orbis.react()
    Used to react to a post shared on Orbis.

    How to use?
    let res = await orbis.react(
      "kjzl6cwe1...e4wvxhiqj",
      "like"
    );

    Parameters
    post_id: ID of the post the user is reacting on
    type: Type of reaction, it can be one of those three options ("like", "haha", "downvote")


  Returns
    {
      status: 200,
      doc: "kjzl6cwe1...e4wvxhiqj",
      result: "Success creating TileDocument."
    }
`;
const decrypt_post_code = `- orbis.decryptPost(): Decrypts an encrypted post.

  How to use?
  let res = await orbis.decryptPost(content);

  Parameters
  content: JSON object that contains the full content of the post
    ...: The full content of the post
  encryptedBody: object JSON object containing the encryption details. This object will be part of the content object when using the getPosts or getPost queries.
    encryptedString: string (child of encryptedBody) Encrypted string generated by Lit Protocol
    encryptedSymmetricKey: string (child of encryptedBody) Encrypted symmetric key generated by Lit Protocol
    accessControlConditions: string (child of encryptedBody) Array of access control conditions stored as a string


  Examples
  /** Once you loaded the post details you can call */
  let res = await orbis.decryptPost(post.content);
  Returns
  {
    result: "Content of the post decrypted"
  }`;
const create_group_code = `- orbis.createGroup(): Will create a new Orbis group.

    How to use?
    let res = await orbis.createGroup({
      pfp: "https://...",
      name: "Orbis Community"
    });

    Parameters
    content: JSON object that contains the details of the group
    pfp: string Profile picture for the group
    name: string Name of the group
    description: string Description of the group
    Returns
    {
      status: 200,
      doc: "kjzl6cwe1...e4wvxhiqj",
      result: "Success creating TileDocument."
    }`;
const update_profile_code = `- orbis.updateProfile()
  Used to for users to update their profile details.

  How to use?
  let res = await orbis.updateProfile({
    pfp: "https://...",
    username: "baptiste"
  });
  Parameters
  - content: JSON object containing the profile details with the following optional elements
      pfp: string (child of content) A valid URL pointing to the user’s profile picture
      cover: string (child of content) A valid URL pointing to the user’s cover picture
      username: string (child of content) Username of the user, not unique for now
      description: string (child of content) Description of the user
      pfpIsNft: object (child of content) Can be used to set an NFT as a verified profile picture
        chain: string (child of pfpIsNft) Only ethereum or polygon are supported
        contract: string (child of pfpIsNft) The contract address
        tokenId: string (child of pfpIsNft) The id of the token in the smart-contract
        timestamp: string (child of pfpIsNft) Current timestamp
      data: object (child of content) optional Can be used to attach some custom data to a profile

  Example
  /** Example to use a verified Azuki as a profile picture */
  let res = await orbis.updateProfile({
    pfp: "https://...",
    username: "Baptiste",
    pfpIsNft: {
      chain: "ethereum",
      contract: "0xed5af388653567af2f388e6224dc7c4b3241c544",
      tokenId: "0x00000000000000000000000000000000000000000000000000000000000013c4",
      timestamp: "1658297026"
    }
  });

  Returns
  {
    status: 200,
    doc: "kjzl6cwe1...e4wvxhiqj",
    result: "Success creating TileDocument."
  }
`;
const set_email_code = `- orbis.setEmail(): Will encrypt a user's email address and attach it to its profile which can then be used to send notifications for replies and mentions etc. The user must be connected when using this feature.

  How to use?
  let res = await orbis.setEmail("email@example.com");

  Parameters
    email: string User's email address.

  Returns
  {
    status: 200,
    doc: "kjzl6cwe1...e4wvxhiqj",
    result: "Success creating TileDocument.",
    encryptedEmail: {
      encryptedString: "",
      encryptedSymmetricKey: "",
      accessControlConditions: ""
    }
  }
`;
const get_posts_code = `- orbis.getPosts(): Returns an array of posts created on Orbis.

  How to use?
  let { data, error } = await orbis.getPosts();

  Parameters
  - options: JSON object containing the filters you can use in this query:
      context: string - (child of option) Context for which you want to retrieve the posts
      did: string (child of option) Retrieving posts shared by a specific user
      master: string (child of option) When quering the comments under a parent post
      only_master: boolean (child of option) Use true if you want only master posts to be returned
      tag: string (child of option) To query only posts shared with a specific tag
      page: int (child of option) Is 0 by default, increment this to retrieve additional posts
      limit: (child of option) int default and max is 50

  Examples
  /** To query the posts from a specific context */
  orbis.getPosts({ context: "k..." });

  /** To query the posts from a specific context with a specific tag */
  orbis.getPosts({ context: "k...", tag: "main-category" });

  /** To query the comments under a post */
  orbis.getPosts({ master: "k..." });

  /** To query the posts shared by a specific did */
  orbis.getPosts({ did: "did:pkh:..." });

  /** To query the posts shared on the global feed */
  orbis.getPosts({ algorithm: "recommendations" });

  /** To query the master posts shared in a context */
  orbis.getPosts({
    algorithm: "all-context-master-posts",
    context: "k..."
  });

  Returns a list of post objects:
  [
    {
      stream_id: "kjzl6cwe1...e4wvxhiqj",
      creator: "did:pkh:...",
      creator_details: {
        did: "did:pkh:...",
        profile: {
          username: "Baptiste",
          pfp: "https://..."
        }
      },
      content: {
        body: "Content of the post itself",
        ...
      },
      context: null,
      context_details: {
        group_id: "...",
        group_details: {
          ...
        },
        channel_id: "...",
        channel_details: {
          ...
        },
      },
      master: "k...",
      reply_to: "k...",
      reply_to_details: {
        body: "Parent post being replied to...",
        ...
      },
      count_likes: 0,
      count_haha: 0,
      count_downvotes: 0,
      count_replies: 0
    },
    ...
  ]`;


export const initPrompt = `You are AI system built with the Orbis SDK and OpenAI. All of the messages you send and conversations created are stored on the Orbis Open Social Protocol.

Here is some initial knowledge that I want you to have:

${what_is_orbis}

${installation_code}
${getting_started_code}

${is_connected_code}
${connect_v2_code}

${create_post_code}
${react_code}
${create_group_code}
${update_profile_code}
${set_email_code}

${get_posts_code}
`;
